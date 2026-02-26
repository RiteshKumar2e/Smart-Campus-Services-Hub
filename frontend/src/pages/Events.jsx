import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/events.css'

const API = 'http://localhost:5000/api'

const EVENT_EMOJIS = {
    workshop: '💡', fest: '🎭', competition: '🏆', career: '💼', seminar: '🎤', default: '🎉'
}

const EVENT_BG = {
    workshop: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    fest: 'linear-gradient(135deg, #fef9c3, #fed7aa)',
    competition: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    career: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
    seminar: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
}

const DEPARTMENTS = [
    { name: 'Computer Science', icon: '💻' },
    { name: 'IT Department', icon: '🌐' },
    { name: 'Cultural Committee', icon: '🎭' },
    { name: 'Placement Cell', icon: '💼' },
    { name: 'Arts', icon: '🎨' },
    { name: 'Sports', icon: '⚽' },
]

export default function Events() {
    const [events, setEvents] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeType, setActiveType] = useState('all')
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState({ 'Computer Science': true, 'Cultural Committee': true, 'Placement Cell': false, 'IT Department': false, 'Arts': false, 'Sports': false })
    const [registering, setRegistering] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API}/events`)
                setEvents(res.data.data)
                setFiltered(res.data.data)
            } catch { } finally { setLoading(false) }
        }
        fetchEvents()
    }, [])

    useEffect(() => {
        let result = events
        if (activeType !== 'all') result = result.filter(e => e.type === activeType)
        if (search) result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()))
        setFiltered(result)
    }, [activeType, search, events])

    const handleRegister = async (event) => {
        setRegistering(event.id)
        try {
            const res = await axios.post(`${API}/events/${event.id}/register`)
            setEvents(prev => prev.map(e => e.id === event.id ? { ...e, registrations: e.registrations + 1 } : e))
            toast.success(`✅ Registered for "${event.title}"!`)
        } catch (err) {
            if (err.response?.data?.message === 'Event is full') {
                toast.error('This event is full!')
            } else {
                toast.error('Registration failed. Try again.')
            }
        } finally { setRegistering(null) }
    }

    const toggleNotif = (dept) => {
        setNotifications(prev => {
            const next = { ...prev, [dept]: !prev[dept] }
            if (next[dept]) toast.success(`🔔 Notifications enabled for ${dept}`)
            else toast.success(`🔕 Notifications disabled for ${dept}`)
            return next
        })
    }

    const types = ['all', ...new Set(events.map(e => e.type))]

    const getCapacityClass = (reg, max) => {
        const pct = reg / max
        if (pct >= 0.9) return 'fill-high'
        if (pct >= 0.6) return 'fill-medium'
        return 'fill-low'
    }

    return (
        <main className="page-wrapper">
            <div className="container">
                {/* Hero */}
                <div className="events-hero-strip animate-fade-in-up">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 className="events-hero-title">🎉 Event Discovery</h1>
                        <p className="events-hero-sub">Department-wise notifications • Register instantly • Never miss campus events</p>
                        <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <div style={{ fontSize: 13, opacity: 0.85 }}>📅 {events.length} upcoming events</div>
                            <div style={{ fontSize: 13, opacity: 0.85 }}>🔔 {Object.values(notifications).filter(Boolean).length} subscriptions active</div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="notif-settings animate-fade-in-up" style={{ animationDelay: '0.1s', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔔 Department Notifications</h2>
                    <div className="dept-notif-list">
                        {DEPARTMENTS.map(dept => (
                            <div className="dept-notif-item" key={dept.name}>
                                <div className="dept-notif-info">
                                    <span className="dept-notif-icon">{dept.icon}</span>
                                    <div>
                                        <div className="dept-notif-name">{dept.name}</div>
                                        <div className="dept-notif-count">{events.filter(e => e.department === dept.name).length} events</div>
                                    </div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={notifications[dept.name] || false} onChange={() => toggleNotif(dept.name)} />
                                    <span className="toggle-slider" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="events-filters animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input className="search-input" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {types.map(type => (
                        <button key={type} className={`filter-chip ${activeType === type ? 'active' : ''}`} onClick={() => setActiveType(type)}>
                            {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="events-grid">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)' }} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">🎭</div><p>No events found</p></div>
                ) : (
                    <div className="events-grid">
                        {filtered.map((e, idx) => {
                            const pct = Math.round(e.registrations / e.maxCapacity * 100)
                            return (
                                <div className={`event-card animate-fade-in-up`} key={e.id} style={{ animationDelay: `${idx * 0.07}s` }}>
                                    <div className="event-card-banner" style={{ background: EVENT_BG[e.type] || 'var(--gray-50)' }}>
                                        <span>{EVENT_EMOJIS[e.type] || '🎉'}</span>
                                        <span className={`event-type-chip type-${e.type}`}>{e.type}</span>
                                    </div>
                                    <div className="event-card-body">
                                        <div className="event-dept-badge">🏛️ {e.department}</div>
                                        <h3 className="event-title">{e.title}</h3>
                                        <p className="event-desc">{e.description}</p>
                                        <div className="event-details-row">
                                            <div className="event-detail">📅 {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                            <div className="event-detail">🕐 {e.time}</div>
                                            <div className="event-detail">📍 {e.venue}</div>
                                        </div>
                                        {e.tags?.length > 0 && (
                                            <div className="event-tags">
                                                {e.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                            </div>
                                        )}
                                        <div className="event-card-footer">
                                            <div className="event-capacity-bar-wrap">
                                                <div className="event-capacity-label">
                                                    <span>Registrations</span>
                                                    <span>{e.registrations}/{e.maxCapacity} ({pct}%)</span>
                                                </div>
                                                <div className="event-capacity-bar">
                                                    <div className={`event-capacity-fill ${getCapacityClass(e.registrations, e.maxCapacity)}`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                            <button
                                                className={`btn btn-primary btn-sm event-register-btn`}
                                                onClick={() => handleRegister(e)}
                                                disabled={registering === e.id || pct >= 100}
                                            >
                                                {pct >= 100 ? 'Full' : registering === e.id ? '...' : 'Register'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
