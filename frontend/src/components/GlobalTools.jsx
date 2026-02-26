import { useState, useEffect } from 'react'
import { ArrowUp, Bot } from 'lucide-react'
import Chatbot from './Chatbot'
import '../styles/landing.css' // Uses common styles for launcher

export default function GlobalTools() {
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [showChatbot, setShowChatbot] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <div className="floating-controls">
                <button
                    className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
                    onClick={scrollToTop}
                    title="Scroll to Top"
                >
                    <ArrowUp size={24} />
                </button>

                {!showChatbot && (
                    <div className="chatbot-launcher" onClick={() => setShowChatbot(true)}>
                        <div className="chatbot-ai-icon">
                            <Bot size={28} />
                        </div>
                        <span className="chatbot-badge">Hi!</span>
                    </div>
                )}
            </div>

            {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
        </>
    )
}
