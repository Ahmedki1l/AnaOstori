// services/morasalaty.js

import axios from 'axios';

export const sendMessage = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    const { buyerPhone, buyerFullName, buyerEmail, gender, messageContent } = req.body;

    const apiToken = process.env.NEXT_PUBLIC_MORASALATY_API_TOKEN;
    const baseURL = 'https://crm.morasalaty.net/api';

    try {
        // Step 1: Fetch Subscribers by Phone Number
        const getSubscribersResponse = await axios.get(`${baseURL}/subscribers`, {
            params: { phone: buyerPhone },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
            },
        });

        let user_ns;

        if (getSubscribersResponse.data.data.length > 0) {
            // Subscriber exists
            user_ns = getSubscribersResponse.data.data[0].user_ns;
        } else {
            // Subscriber does not exist, create a new one
            const nameParts = buyerFullName.trim().split(' ');
            const first_name = nameParts[0];
            const last_name = nameParts.slice(1).join(' ') || '';

            const createSubscriberResponse = await axios.post(`${baseURL}/subscriber/create`, {
                first_name,
                last_name,
                name: buyerFullName,
                phone: buyerPhone,
                email: buyerEmail,
                gender,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                },
            });

            if (createSubscriberResponse.data.status !== 'ok') {
                return res.status(500).json({ status: 'error', message: 'Failed to create subscriber' });
            }

            user_ns = createSubscriberResponse.data.data.user_ns;
        }

        // Step 2: Send WhatsApp Message
        const sendMessageResponse = await axios.post(`${baseURL}/subscriber/send-text`, {
            user_ns,
            content: messageContent,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
            },
        });

        if (sendMessageResponse.data.status !== 'ok') {
            return res.status(500).json({ status: 'error', message: 'Failed to send message' });
        }

        return res.status(200).json({ status: 'ok', message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error interacting with Morasalaty API:', error.response ? error.response.data : error.message);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
