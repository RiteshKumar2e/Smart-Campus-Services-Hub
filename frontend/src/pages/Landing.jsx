import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
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

export default function Landing() {
    return (
        <div className="landing">
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
                        <li><a href="#features">Features</a></li>
                        <li><a href="#how">How It Works</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div className="hero-nav-cta">
                        <Link to="/login" className="btn btn-primary">
                            Sign In →
                        </Link>
                        <Link to="/register" className="btn btn-secondary">
                            Register
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

            {/* Testimonials */}
            <section style={{ padding: '100px 0', background: 'var(--gray-50)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">💬 Testimonials</div>
                        <h2 className="section-main-title">What Students Say</h2>
                    </div>
                    <div className="testimonials-grid">
                        {[
                            { name: 'Rahul Sharma', role: '3rd Year CSE', text: 'The canteen pre-ordering is a lifesaver. No more standing in line for 20 minutes between classes!', avatar: '👨‍🎓' },
                            { name: 'Priya Verma', role: '2nd Year Arts', text: 'Found my lost keys within 2 hours thanks to the auto-matching system. It actually works!', avatar: '👩‍🎓' },
                            { name: 'Aman Gupta', role: '4th Year IT', text: 'Reporting a leak in the hostel was so easy. The plumber arrived in 30 minutes. Amazing efficiency.', avatar: '👨‍🎓' }
                        ].map((t, i) => (
                            <div key={i} className="testimonial-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="testimonial-quote">"</div>
                                <p className="testimonial-text">{t.text}</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.avatar}</div>
                                    <div>
                                        <div className="testimonial-name">{t.name}</div>
                                        <div className="testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
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

            {/* CTA */}
            <section className="cta-section" id="about">
                <div className="cta-banner">
                    <h2 className="cta-title">Ready to Simplify Campus Life?</h2>
                    <p className="cta-desc">Join thousands of students already saving 30+ minutes every day.</p>
                    <Link to="/dashboard" className="cta-btn">
                        🚀 Launch Smart Campus Hub
                    </Link>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact" style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">📞 Get in Touch</div>
                        <h2 className="section-main-title">Contact Our Team</h2>
                        <p className="section-desc">Have questions or feedback? We'd love to hear from you.</p>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-card">
                                <div className="contact-card-icon">📍</div>
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>Academic Block A, Campus East</p>
                                </div>
                            </div>
                            <div className="contact-card">
                                <div className="contact-card-icon">📧</div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p>support@campus-hub.edu</p>
                                </div>
                            </div>
                            <div className="contact-card">
                                <div className="contact-card-icon">📱</div>
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>
                        </div>

                        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); toast.success('Message sent! We will get back to you.') }}>
                            <div className="form-group">
                                <input type="text" placeholder="Your Name" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Campus Email" required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="How can we help?" rows="4" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="hero-logo">
                            <div className="hero-logo-icon" style={{ background: 'rgba(255,255,255,0.1)' }}>🎓</div>
                            <span className="hero-logo-text" style={{ color: 'white' }}>Smart<span>Campus</span></span>
                        </div>
                        <p>Replacing inefficient processes with one unified digital platform for modern campus life.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            {FEATURES.map(f => <li key={f.link}><Link to={f.link}>{f.title}</Link></li>)}
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Campus</h4>
                        <ul>
                            <li><a href="#">Student Portal</a></li>
                            <li><a href="#">Academic Calendar</a></li>
                            <li><a href="#">Faculty Directory</a></li>
                            <li><a href="#">Alumni Network</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Report Bug</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 Smart Campus Services Hub. All rights reserved.</span>
                    <span>Built with ❤️ for modern campus life</span>
                </div>
            </footer>
        </div>
    )
}
