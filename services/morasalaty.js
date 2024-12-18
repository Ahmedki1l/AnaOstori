// services/morasalaty.js

import axios from 'axios';

export const sendMessage = async function handler(req, res) {
    const { buyerPhone, buyerFullName, buyerEmail, gender, linkToUse, classRoomCode } = req.body;

    const apiToken = process.env.NEXT_PUBLIC_MORASALATY_API_TOKEN;
    const baseURL = 'whatsapp.morasalaty.net';

    try {
        const sendMessageResponse = await axios.post(`${baseURL}/rest/sendtemplate`, {
            Token: apiToken,
            Mobile:buyerPhone,
            TemplateId:"9636451f-1adf-488c-9555-a06b21978153",
            HeaderUrl:"https://rep.morasalaty.net/samples/myphoto.jpg",
            Params: [buyerFullName, linkToUse, classRoomCode]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
            },
        });

        if (!sendMessageResponse.data.Sent) {
            return res.status(500).json({ status: 'error', message: sendMessageResponse.data.Message });
        }

        return res.status(200).json({ status: 'ok', message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error interacting with Morasalaty API:', error.response ? error.response.data : error.message);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
