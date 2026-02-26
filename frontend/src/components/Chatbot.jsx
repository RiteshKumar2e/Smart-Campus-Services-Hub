import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, X, Maximize2, Minimize2, Bot } from 'lucide-react';
import '../styles/chatbot.css';

const Chatbot = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi 👋 I'm the AI Support Agent. I can help you understand this website or take your complaint.", sender: 'ai' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
                        { role: "user", content: input }
                    ]
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: data.data, sender: 'ai' }]);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error calling Chatbot API:', error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm having trouble connecting to the campus hub right now. Please try again later!", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={`chatbot-container ${isOpen ? 'active' : ''}`}>
            <div className="chatbot-header">
                <div className="header-left">
                    <span className="bot-emoji">🤖</span>
                    <span className="bot-name">AI Agent</span>
                </div>
                <div className="header-actions">
                    <button className="action-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                        <div className={`message-bubble ${msg.sender}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message-wrapper ai">
                        <div className="message-bubble ai typing">
                            AI is thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
                <div className="input-row">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="mic-btn">
                        <Mic size={20} />
                    </button>
                    <button className="send-btn" onClick={handleSend} disabled={isLoading}>
                        {isLoading ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
