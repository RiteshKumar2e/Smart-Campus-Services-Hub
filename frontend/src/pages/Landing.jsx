import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Github, Linkedin, MapPin, Phone, X, ArrowUp, Bot } from 'lucide-react'
import '../styles/landing.css'
import ThreeBackground from '../components/ThreeBackground'

const FEATURES = [
    {
        icon: '🍽️',
        title: 'Smart Canteen',
        desc: 'Pre-order meals with real-time kitchen status and precise pickup ETA. Skip the queue.',
        color: 'linear-gradient(135deg, #fef9c3, #fef3c7)',
        link: '/canteen'
    },
    {
        icon: '🔧',
        title: 'Issue Reporting',
        desc: 'Report maintenance issues with photo + GPS pin. Get real-time status updates.',
        color: 'linear-gradient(135deg, #fee2e2, #fecaca)',
        link: '/maintenance'
    },
    {
        icon: '🔍',
        title: 'Lost & Found',
        desc: 'Post lost items with photos. AI auto-matches and notifies when your item is found.',
        color: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
        link: '/lost-found'
    },
    {
        icon: '🎉',
        title: 'Event Discovery',
        desc: 'Department-wise push notifications for workshops, fests, and career opportunities.',
        color: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
        link: '/events'
    },
    {
        icon: '🗺️',
        title: 'Campus Navigation',
        desc: 'Interactive map with live "you-are-here" dot and smart pathfinding to any building.',
        color: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
        link: '/map'
    },
    {
        icon: '🚌',
        title: 'Transport Tracker',
        desc: 'Live bus tracking, route status, and next arrival times across all campus routes.',
        color: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        link: '/transport'
    },
]

const STEPS = [
    { num: '01', title: 'Sign Up', desc: 'Log in with your campus credentials in seconds' },
    { num: '02', title: 'Choose Service', desc: 'Pick from 6 integrated campus services' },
    { num: '03', title: 'Take Action', desc: 'Order food, report issues, find lost items & more' },
    { num: '04', title: 'Get Updates', desc: 'Real-time notifications keep you in the loop always' },
]

const CAMPUS_LINKS = [
    { title: 'Student Portal', desc: 'Access your grades, attendance, and course materials in one place.' },
    { title: 'Academic Calendar', desc: 'Stay updated with exam schedules, holidays, and important dates.' },
    { title: 'Faculty Directory', desc: 'Find contact information and office hours for your professors.' },
    { title: 'Alumni Network', desc: 'Connect with former students and explore mentorship opportunities.' }
]

const SUPPORT_LINKS = [
    { title: 'Help Center', desc: 'Find answers to frequently asked questions and troubleshooting guides.' },
    { title: 'Report Bug', desc: 'Help us improve by reporting any technical issues you encounter.' },
    { title: 'Privacy Policy', desc: 'Learn how we protect and manage your personal data.' },
    { title: 'Terms of Use', desc: 'The rules and guidelines for using our campus platform.' }
]

export default function Landing() {
    const [modalData, setModalData] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const closeModal = () => setModalData(null);

    return (
        <div className="landing">
            {/* Modal Popup */}
            {modalData && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={closeModal}>
                            <X size={20} />
                        </button>
                        <div className="modal-header">
                            <h2>{modalData.title}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{modalData.desc}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero */}
            <section className="hero">
                <ThreeBackground />
                <div className="hero-overlay" />

                <nav className="hero-nav">
                    <Link to="/" className="hero-logo">
                        <div className="hero-logo-icon">🎓</div>
                        <span className="hero-logo-text">Smart<span>Campus</span></span>
                    </Link>
                    <ul className="hero-nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="#mission">Mission</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#goals">Goals</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div className="hero-nav-cta">
                        <Link to="/login" className="btn btn-primary">
                            Sign In
                        </Link>
                        <Link to="/admin-login" className="btn btn-admin">
                            Admin Login
                        </Link>
                    </div>
                </nav>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot" />
                        Now Live • All Services in One Place
                    </div>

                    <h1 className="hero-title">
                        Your Campus,<br />
                        <span className="highlight">Reimagined</span>
                    </h1>

                    <p className="hero-subtitle">
                        One powerful platform replacing 7 WhatsApp groups. Order food, report issues,
                        find lost items, discover events, and navigate campus — all in one tap.
                    </p>

                    <div className="hero-cta-group">
                        <Link to="/login" className="btn btn-primary btn-lg">
                            🚀 Get Started Free
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">
                            Explore Features
                        </a>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-number">7+</div>
                            <div className="hero-stat-label">WhatsApp Groups Replaced</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">30min</div>
                            <div className="hero-stat-label">Daily Time Saved</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">6</div>
                            <div className="hero-stat-label">Services Unified</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">5k+</div>
                            <div className="hero-stat-label">Daily Active Students</div>
                        </div>
                    </div>
                </div>

                <div className="hero-scroll-indicator">
                    <span>Scroll to explore</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section" id="mission" style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">🎯 Our Mission</div>
                        <h2 className="section-main-title">Bridging the Gap Between<br /><span className="highlight">Students & Campus Services</span></h2>
                        <p className="section-desc">
                            Our mission is to eliminate the chaos of scattered WhatsApp groups and manual processes.
                            By unifying essential services into a single, intuitive platform, we empower students
                            to focus more on learning and less on campus logistics.
                        </p>
                    </div>
                    <div className="mission-grid">
                        <div className="mission-card">
                            <h3>Efficiency</h3>
                            <p>Reducing time spent on daily tasks like food ordering and issue reporting by 50%.</p>
                        </div>
                        <div className="mission-card">
                            <h3>Transparency</h3>
                            <p>Real-time tracking for every request, from kitchen orders to plumbing fixes.</p>
                        </div>
                        <div className="mission-card">
                            <h3>Connection</h3>
                            <p>A central hub that connects the entire campus community instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section" id="features">
                <div className="section-header">
                    <div className="section-label">✨ Platform Features</div>
                    <h2 className="section-main-title">Everything You Need on Campus</h2>
                    <p className="section-desc">
                        Six powerful services, one intuitive interface. No more switching between apps and groups.
                    </p>
                </div>
                <div className="features-grid">
                    {FEATURES.map((f, i) => (
                        <Link to={f.link} className="feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="feature-card-icon" style={{ background: f.color }}>
                                {f.icon}
                            </div>
                            <h3 className="feature-card-title">{f.title}</h3>
                            <p className="feature-card-desc">{f.desc}</p>
                            <div className="feature-card-arrow">
                                Explore <span>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="how-section" id="how">
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="section-header">
                        <div className="section-label">📋 Process</div>
                        <h2 className="section-main-title">As Simple as 1-2-3-4</h2>
                        <p className="section-desc">Get started in under 30 seconds. No tutorials needed.</p>
                    </div>
                    <div className="steps-grid">
                        {STEPS.map((s, i) => (
                            <div className="step-item" key={i}>
                                <div className="step-number">{s.num}</div>
                                <h4 className="step-title">{s.title}</h4>
                                <p className="step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '80px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">📊 Impact</div>
                        <h2 className="section-main-title">Trusted by Our Campus</h2>
                    </div>
                    <div className="landing-stats-grid">
                        {[
                            { val: '2,400+', label: 'Daily Orders', icon: '🍽️' },
                            { val: '98%', label: 'Issues Resolved', icon: '✅' },
                            { val: '340+', label: 'Items Reunited', icon: '🎒' },
                            { val: '50+', label: 'Monthly Events', icon: '🎉' },
                        ].map((s, i) => (
                            <div key={i} className="stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="stat-card-icon">{s.icon}</div>
                                <div className="stat-card-val">{s.val}</div>
                                <div className="stat-card-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Goals Section */}
            <section className="goals-section" id="goals" style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">🚀 Our Goals</div>
                        <h2 className="section-main-title">Designing the Future of<br /><span className="highlight">Digital Campus Living</span></h2>
                    </div>
                    <div className="goals-container">
                        <div className="goal-item">
                            <div className="goal-icon">📊</div>
                            <div className="goal-info">
                                <h4>100% Digital Workflow</h4>
                                <p>Transitioning all physical paperwork and manual registrations to automated digital systems.</p>
                            </div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">🤖</div>
                            <div className="goal-info">
                                <h4>AI-Powered Support</h4>
                                <p>Implementing smart assistants to handle instant queries and automated lost-and-found matching.</p>
                            </div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">📱</div>
                            <div className="goal-info">
                                <h4>Unified Ecosystem</h4>
                                <p>Expanding to include libraries, lab bookings, and faculty appointments by late 2026.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '100px 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="section-header">
                        <div className="section-label">❓ FAQ</div>
                        <h2 className="section-main-title">Common Questions</h2>
                    </div>
                    <div className="faq-list">
                        {[
                            { q: 'Is this app free to use?', a: 'Yes, SmartCampus is completely free for all students and faculty members with a valid campus ID.' },
                            { q: 'How do I pay for canteen orders?', a: 'You can link your Campus Wallet, UPI, or use Net Banking for seamless pre-ordering.' },
                            { q: 'Can I track my maintenance request?', a: 'Absolutely! You will receive real-time updates as your issue goes from pending to resolved.' },
                            { q: 'Is my data secure?', a: 'We use enterprise-grade encryption to ensure your personal and academic data remains private.' }
                        ].map((f, i) => (
                            <details key={i} className="faq-item animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <summary className="faq-question">{f.q}</summary>
                                <div className="faq-answer">{f.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="contact">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="hero-logo">
                            <div className="hero-logo-icon" style={{ background: 'rgba(255,255,255,0.1)' }}>🎓</div>
                            <span className="hero-logo-text" style={{ color: 'white' }}>Smart<span>Campus</span></span>
                        </div>
                        <p>Replacing inefficient processes with one unified digital platform for modern campus life.</p>
                        <div className="footer-socials">
                            <a href="https://github.com/RiteshKumar2e" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
                            <a href="https://www.linkedin.com/in/ritesh-kumar-b3a654253" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                            <a href="mailto:riteshkumar90359@gmail.com"><Mail size={20} /></a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            {FEATURES.map(f => (
                                <li key={f.link}>
                                    <button onClick={() => setModalData({ title: f.title, desc: f.desc })} className="footer-pop-btn">
                                        {f.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Campus</h4>
                        <ul>
                            {CAMPUS_LINKS.map(c => (
                                <li key={c.title}>
                                    <button onClick={() => setModalData({ title: c.title, desc: c.desc })} className="footer-pop-btn">
                                        {c.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            {SUPPORT_LINKS.map(s => (
                                <li key={s.title}>
                                    <button onClick={() => setModalData({ title: s.title, desc: s.desc })} className="footer-pop-btn">
                                        {s.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 Smart Campus Services Hub. All rights reserved.</span>
                    <span>Built with ❤️ for modern campus life</span>
                </div>
            </footer>

            {/* Floating Elements */}
            <div className="floating-controls">
                <button
                    className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
                    onClick={scrollToTop}
                    title="Scroll to Top"
                >
                    <ArrowUp size={24} />
                </button>

                <div className="chatbot-launcher" onClick={() => setModalData({
                    title: 'Smart AI Assistant',
                    desc: 'I am your campus AI helpmate. How can I assist you today? (This is a preview of the upcoming chatbot feature!)'
                })}>
                    <div className="chatbot-ai-ring" />
                    <div className="chatbot-ai-icon">
                        <Bot size={28} />
                    </div>
                    <span className="chatbot-badge">Hi!</span>
                </div>
            </div>
        </div>
    )
}
