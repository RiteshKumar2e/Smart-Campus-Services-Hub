import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/dashboard.css'

const API = 'http://localhost:5000/api'

const QUICK_ACCESS = [
    { to: '/canteen', icon: '🍽️', title: 'Canteen', subtitle: 'Order food now', bg: 'linear-gradient(135deg, #fef9c3, #fef3c7)', color: '#a16207' },
    { to: '/maintenance', icon: '🔧', title: 'Maintenance', subtitle: 'Report an issue', bg: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#b91c1c' },
    { to: '/lost-found', icon: '🔍', title: 'Lost & Found', subtitle: 'Search items', bg: 'linear-gradient(135deg, #dcfce7, #d1fae5)', color: '#15803d' },
    { to: '/events', icon: '🎉', title: 'Events', subtitle: 'Upcoming events', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', color: '#6d28d9' },
    { to: '/map', icon: '🗺️', title: 'Campus Map', subtitle: 'Navigate campus', bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', color: '#0369a1' },
    { to: '/transport', icon: '🚌', title: 'Transport', subtitle: 'Bus schedules', bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', color: '#15803d' },
    { to: '/canteen', icon: '🛒', title: 'My Orders', subtitle: 'Track orders', bg: 'linear-gradient(135deg, #fff7ed, #fed7aa)', color: '#c2410c' },
    { to: '/maintenance', icon: '📊', title: 'Issue Tracker', subtitle: 'View my reports', bg: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', color: '#0369a1' },
]

const ACTIVITIES = [
    { icon: '✅', iconBg: '#dcfce7', title: 'Canteen Order Ready', desc: 'Your Masala Dosa + Cold Coffee is ready for pickup!', time: '2 min ago' },
    { icon: '🔧', iconBg: '#dbeafe', title: 'Maintenance Update', desc: 'Issue #MNT-042 status changed to "In Progress"', time: '15 min ago' },
    { icon: '🎉', iconBg: '#ede9fe', title: 'Event Reminder', desc: 'Tech Symposium 2026 starts in 2 days • Auditorium', time: '1 hr ago' },
    { icon: '🔍', iconBg: '#dcfce7', title: 'Lost Item Match!', desc: 'Someone found an item matching your "Blue Backpack" report', time: '3 hr ago' },
    { icon: '🚌', iconBg: '#fef9c3', title: 'Bus Alert', desc: 'Route B is delayed by 8 minutes due to traffic', time: '5 hr ago' },
]

export default function Dashboard() {
    const [kitchenStatus, setKitchenStatus] = useState({ isOpen: true, avgWaitTime: 12, activeOrders: 5 })
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [greeting, setGreeting] = useState('')
    const [dateStr, setDateStr] = useState('')

    useEffect(() => {
        const h = new Date().getHours()
        if (h < 12) setGreeting('Good Morning')
        else if (h < 17) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')

        setDateStr(new Date().toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }))

        const fetchData = async () => {
            try {
                const [kitchenRes, eventsRes] = await Promise.all([
                    axios.get(`${API}/canteen/kitchen-status`),
                    axios.get(`${API}/events`)
                ])
                setKitchenStatus(kitchenRes.data.data)
                setEvents(eventsRes.data.data.slice(0, 4))
            } catch {
                // use defaults
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const stats = [
        { icon: '🍽️', bg: '#fef9c3', label: 'Active Orders', val: '3', change: '↑ 2 today', up: true },
        { icon: '🔧', bg: '#fee2e2', label: 'Open Issues', val: '2', change: '↓ 1 resolved', up: false },
        { icon: '🎉', bg: '#ede9fe', label: 'Events This Week', val: '8', change: '↑ 3 new', up: true },
        { icon: '🚌', bg: '#e0f2fe', label: 'Next Bus', val: '8m', change: 'Route B on time', up: true },
    ]

    return (
        <main className="dashboard">
            <div className="container">
                {/* Header */}
                <div className="page-header animate-fade-in-up" style={{ marginBottom: 28 }}>
                    <p className="dashboard-greeting">{greeting} 👋</p>
                    <h1 className="dashboard-greeting-name">Welcome back, <span>Anmol</span>!</h1>
                    <p className="dashboard-date">📅 {dateStr}</p>
                    <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--primary-ultra-light)', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>
                        🎓 Smart Campus Services Hub • Your all-in-one campus platform
                    </div>
                </div>

                {/* Stats Row */}
                <div className="dashboard-stats">
                    {stats.map((s, i) => (
                        <div className="d-stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }} key={i}>
                            <div className="d-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                            <div>
                                <div className="d-stat-val">{s.val}</div>
                                <div className="d-stat-label">{s.label}</div>
                                <div className={`d-stat-change ${s.up ? 'change-up' : 'change-down'}`}>{s.change}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Access */}
                <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: 28, border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Quick Access</h2>
                        <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>All services</span>
                    </div>
                    <div className="quick-access-grid">
                        {QUICK_ACCESS.map((item, i) => (
                            <Link to={item.to} className="quick-access-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="quick-access-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                                <div className="quick-access-title">{item.title}</div>
                                <div className="quick-access-subtitle">{item.subtitle}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Activity Feed */}
                    <div className="dashboard-activity animate-fade-in-up">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Recent Activity</h2>
                            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View all</button>
                        </div>
                        {ACTIVITIES.map((a, i) => (
                            <div className="activity-item" key={i}>
                                <div className="activity-icon" style={{ background: a.iconBg }}>{a.icon}</div>
                                <div className="activity-content">
                                    <div className="activity-title">{a.title}</div>
                                    <div className="activity-desc">{a.desc}</div>
                                </div>
                                <div className="activity-time">{a.time}</div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Kitchen Status */}
                        <div className="kitchen-widget animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>🍽️ Kitchen Status</h3>
                                <div className="live-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 4px rgba(16,185,129,0.2)' }} />
                            </div>
                            <div className={`kitchen-status-badge ${kitchenStatus.isOpen ? 'kitchen-open' : 'kitchen-closed'}`}>
                                {kitchenStatus.isOpen ? '✅ Canteen Open' : '🔴 Canteen Closed'}
                            </div>
                            <div className="kitchen-metrics">
                                <div className="kitchen-metric">
                                    <div className="kitchen-metric-value">{kitchenStatus.avgWaitTime}m</div>
                                    <div className="kitchen-metric-label">Avg Wait</div>
                                </div>
                                <div className="kitchen-metric">
                                    <div className="kitchen-metric-value">{kitchenStatus.activeOrders}</div>
                                    <div className="kitchen-metric-label">Active Orders</div>
                                </div>
                            </div>
                            {kitchenStatus.announcement && (
                                <div className="announcement-banner">
                                    <span>📢</span>
                                    <span>{kitchenStatus.announcement}</span>
                                </div>
                            )}
                            <Link to="/canteen" className="btn btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
                                Order Food →
                            </Link>
                        </div>

                        {/* Upcoming Events */}
                        <div className="events-strip animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>🎉 Upcoming Events</h3>
                                <Link to="/events" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
                            </div>
                            <div className="events-strip-list">
                                {events.length > 0 ? events.map(e => (
                                    <div className="event-strip-card" key={e.id}>
                                        <div className="event-strip-type">{e.type}</div>
                                        <div className="event-strip-title">{e.title}</div>
                                        <div className="event-strip-meta">📅 {e.date} • {e.venue}</div>
                                    </div>
                                )) : (
                                    <>
                                        <div className="event-strip-card">
                                            <div className="event-strip-type">Workshop</div>
                                            <div className="event-strip-title">Tech Symposium 2026</div>
                                            <div className="event-strip-meta">📅 Mar 5 • Auditorium</div>
                                        </div>
                                        <div className="event-strip-card">
                                            <div className="event-strip-type">Fest</div>
                                            <div className="event-strip-title">Cultural Fest - Utsav</div>
                                            <div className="event-strip-meta">📅 Mar 10 • Amphitheater</div>
                                        </div>
                                        <div className="event-strip-card">
                                            <div className="event-strip-type">Competition</div>
                                            <div className="event-strip-title">Hackathon Sprint</div>
                                            <div className="event-strip-meta">📅 Mar 15 • Innovation Lab</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
