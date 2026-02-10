// services/morasalaty.js

import axios from 'axios';

export const sendMessage = async (
    buyerPhone,
    buyerFullName,
    buyerEmail,
    courseTitle,
    locationText,
    locationURL,
    date,
    duration,
    gender,
    whatsapplink,
    courseType,
    classRoomCode = ""
) => {
    try {
        // 3 categories: physical, online, on-demand

        let payload = {
            buyerPhone,
            buyerFullName,
            buyerEmail,
            courseTitle,
            locationText,
            locationURL,
            date,
            duration,
            gender,
            whatsapplink,
            courseType,
            classRoomCode,
            bookShopLink: (courseType === 'online' || courseType === 'on-demand') ? 'https://www.anaostori.com/books' : ''
        };

        // Call the proxy endpoint on my Flask server
        const response = await axios.post('https://sinsintro-api.vercel.app/api/sendWhatsAppMessage', payload, {
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
