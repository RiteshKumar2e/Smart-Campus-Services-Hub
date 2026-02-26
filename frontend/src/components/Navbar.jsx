import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import '../styles/navbar.css'

const NAV_ITEMS = [
    { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/canteen', icon: '🍽️', label: 'Canteen' },
    { to: '/maintenance', icon: '🔧', label: 'Maintenance' },
    { to: '/lost-found', icon: '🔍', label: 'Lost & Found' },
    { to: '/events', icon: '🎉', label: 'Events' },
    { to: '/map', icon: '🗺️', label: 'Campus Map' },
    { to: '/transport', icon: '🚌', label: 'Transport' },
]

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const handleLogout = () => {
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/dashboard" className="navbar-brand">
                        <div className="navbar-brand-icon">🎓</div>
                        <span className="navbar-brand-text">Smart<span>Campus</span></span>
                    </Link>

                    <ul className="navbar-nav">
                        {NAV_ITEMS.map(item => (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className={location.pathname === item.to ? 'active' : ''}
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-actions">
                        {searchOpen ? (
                            <div className="navbar-search-expanded">
                                <input type="text" placeholder="Search services..." autoFocus onBlur={() => setSearchOpen(false)} />
                                <button onClick={() => setSearchOpen(false)}>✕</button>
                            </div>
                        ) : (
                            <button className="navbar-action-btn" onClick={() => setSearchOpen(true)} title="Search">
                                🔍
                            </button>
                        )}

                        <button className="navbar-notification-btn" title="Notifications">
                            🔔
                            <span className="navbar-notif-badge">3</span>
                        </button>

                        <div className="navbar-user-container">
                            <div className="navbar-user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                <div className="navbar-avatar">AK</div>
                                <span className="navbar-user-name">Anmol K.</span>
                                <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
                            </div>

                            {userMenuOpen && (
                                <div className="navbar-dropdown">
                                    <div className="dropdown-header">
                                        <strong>Anmol Kumar</strong>
                                        <span>CS21B10</span>
                                    </div>
                                    <Link to="/dashboard" className="dropdown-item">👤 Profile</Link>
                                    <Link to="/dashboard" className="dropdown-item">⚙️ Settings</Link>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item logout-btn" onClick={handleLogout}>🚪 Logout</button>
                                </div>
                            )}
                        </div>

                        <button
                            className="navbar-hamburger"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <div className="hamburger-line" />
                            <div className="hamburger-line" />
                            <div className="hamburger-line" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div
                    className="mobile-nav-overlay visible"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Link to="/dashboard" className="navbar-brand" onClick={() => setMobileOpen(false)}>
                        <div className="navbar-brand-icon" style={{ width: 32, height: 32, fontSize: 16 }}>🎓</div>
                        <span className="navbar-brand-text">Smart<span>Campus</span></span>
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--gray-600)' }}
                    >
                        ✕
                    </button>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: location.pathname === item.to ? 'var(--primary)' : 'var(--gray-700)',
                                background: location.pathname === item.to ? 'var(--primary-ultra-light)' : 'transparent',
                                fontWeight: 600,
                                fontSize: 15,
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}
