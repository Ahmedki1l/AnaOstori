// services/morasalaty.js

import axios from 'axios';

export const sendMessage = async (
    buyerPhone,
    buyerFullName,
    buyerEmail,
    gender,
    whatsapplink,
    classRoomCode
) => {
    try {
        // Call the proxy endpoint on your Flask server
        const response = await axios.post('https://sinsintro-api.vercel.app/api/sendWhatsAppMessage', {
            buyerPhone,
            buyerFullName,
            buyerEmail,
            gender,
            whatsapplink,
            classRoomCode
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.data.status !== 'ok') {
            return { status: 'error', message: response.data.message || 'Unknown error' };
        }

        return { status: 'ok', message: 'Message sent successfully' };
    } catch (error) {
        console.error('Error interacting with the Flask API:', error.response ? error.response.data : error.message);
        return { status: 'error', message: 'Internal Server Error' };
    }
};
