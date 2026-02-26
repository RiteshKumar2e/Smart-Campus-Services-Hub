const axios = require('axios');

const handleChat = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !messages.length) {
        return res.status(400).json({ success: false, message: 'No messages provided' });
    }

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "mixtral-8x7b-32768",
            messages: [
                {
                    role: "system",
                    content: `You are the official Smart Campus AI Assistant for the 'Smart Campus Services Hub'. 
                    
                    Website Features Information:
                    1. Smart Canteen: Students can pre-order meals, see real-time kitchen status, and get precise pickup ETAs.
                    2. Issue Reporting: Report maintenance problems (plumbing, electrical, etc.) with photos and GPS pins.
                    3. Lost & Found: Post lost items; the system uses AI to auto-match and notify when found.
                    4. Event Discovery: Find workshops, fests, and career opportunities with department-wise notifications.
                    5. Campus Navigation: Interactive map with 'you-are-here' dots and pathfinding to any building.
                    6. Transport Tracker: Live tracking for campus buses and route arrival times.

                    Mission & Goals:
                    - Mission: To unify scattered WhatsApp groups and manual processes into one intuitive platform.
                    - Goals: Achieving a 100% digital workflow, AI-powered support, and a unified ecosystem including libraries and labs by late 2026.

                    Guidelines:
                    - Be helpful, polite, and campus-aware.
                    - If a student asks how to do something, explain the relevant service.
                    - Keep answers concise and student-friendly.`
                },
                ...messages
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            data: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error('Groq API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error communicating with AI service',
            error: error.response?.data || error.message
        });
    }
};

module.exports = { handleChat };
