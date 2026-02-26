import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/transport.css'

const API = 'http://localhost:5000/api'

export default function Transport() {
    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [planResult, setPlanResult] = useState(null)

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await axios.get(`${API}/transport/routes`)
                setRoutes(res.data.data)
            } catch { } finally { setLoading(false) }
        }
        fetchRoutes()

        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const planJourney = () => {
        if (!from || !to) return toast.error('Please enter origin and destination')
        const matching = routes.find(r => r.stops.some(s => s.toLowerCase().includes(from.toLowerCase())) &&
            r.stops.some(s => s.toLowerCase().includes(to.toLowerCase())))
        if (matching) {
            setPlanResult({ route: matching, msg: `Take ${matching.name}. Next bus in ${matching.nextArrival} minutes.` })
            toast.success(`🚌 Route found!`)
        } else {
            setPlanResult({ msg: 'No direct route found. Consider a combination of routes or walking.' })
            toast('💡 No direct route found for that combination.', { icon: 'ℹ️' })
        }
    }

    const swapLocations = () => {
        setFrom(to)
        setTo(from)
    }

    const getCapacityClass = (cur, max) => {
        const p = cur / max
        if (p > 0.8) return 'capacity-high'
        if (p > 0.5) return 'capacity-mid'
        return 'capacity-low'
    }

    const allStops = [...new Set(routes.flatMap(r => r.stops))]

    return (
        <main className="page-wrapper transport-page">
            <div className="container">
                {/* Hero */}
                <div className="transport-hero animate-fade-in-up">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 className="transport-hero-title">🚌 Campus Transport</h1>
                        <p className="transport-hero-sub">Live tracking • Real-time arrivals • All campus routes</p>
                        <div className="live-time-display">
                            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                        </div>
                        <div className="live-time-date">
                            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="transport-stats-strip">
                            <div className="transport-stat-item">
                                <div className="transport-stat-val">{routes.length}</div>
                                <div className="transport-stat-label">Active Routes</div>
                            </div>
                            <div className="transport-stat-item">
                                <div className="transport-stat-val">{routes.filter(r => r.currentStatus === 'on-time').length}</div>
                                <div className="transport-stat-label">On Time</div>
                            </div>
                            <div className="transport-stat-item">
                                <div className="transport-stat-val">{Math.min(...routes.filter(r => r.nextArrival).map(r => r.nextArrival))}m</div>
                                <div className="transport-stat-label">Next Arrival</div>
                            </div>
                            <div className="transport-stat-item">
                                <div className="transport-stat-val">{routes.reduce((s, r) => s + r.currentPassengers, 0)}</div>
                                <div className="transport-stat-label">Passengers</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Journey Planner */}
                <div className="journey-planner animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🧭 Journey Planner</h2>
                    <div className="planner-inputs">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">From</label>
                            <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                                <option value="">Select origin...</option>
                                {allStops.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">To</label>
                            <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                                <option value="">Select destination...</option>
                                {allStops.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">&nbsp;</label>
                            <button className="swap-btn" onClick={swapLocations} title="Swap">⇄</button>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={planJourney} style={{ alignSelf: 'flex-start' }}>
                        🔍 Find Route
                    </button>
                    {planResult && (
                        <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--primary-ultra-light)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 14 }}>
                                {planResult.msg}
                            </p>
                            {planResult.route && (
                                <p style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 4 }}>
                                    Stops: {planResult.route.stops.join(' → ')}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Routes */}
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>All Routes</h2>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-xl)' }} />)}
                    </div>
                ) : (
                    <div className="routes-grid">
                        {routes.map((route, idx) => (
                            <div className="route-card animate-fade-in-up" key={route.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="route-card-header">
                                    <div className="route-card-left">
                                        <div className="route-icon">🚌</div>
                                        <div>
                                            <div className="route-name">{route.name}</div>
                                            <div className="route-type">{route.vehicleType} • Every {route.frequency}</div>
                                        </div>
                                    </div>
                                    <div className="route-status-info">
                                        <span className={`badge status-${route.currentStatus.replace('-', '_').replace(' ', '_')}`}>
                                            {route.currentStatus === 'on-time' ? '✅ On Time' : route.currentStatus === 'delayed' ? '⚠️ Delayed' : '❌ Cancelled'}
                                        </span>
                                        <div className="route-next-arrival">
                                            Next in: <span className="arrival-time">{route.nextArrival}m</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="route-card-body">
                                    {/* Stops Timeline */}
                                    <div className="stops-timeline">
                                        {route.stops.map((stop, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className="stop-item">
                                                    <div className={`stop-dot ${i === 0 ? 'current' : ''}`} />
                                                    <div className={`stop-name ${i === 0 ? 'current-stop' : ''}`}>{stop}</div>
                                                </div>
                                                {i < route.stops.length - 1 && <div className="stop-connector" />}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Capacity */}
                                    <div className="route-capacity-bar">
                                        <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>👥</div>
                                        <div className="capacity-track">
                                            <div
                                                className={`capacity-fill ${getCapacityClass(route.currentPassengers, route.capacity)}`}
                                                style={{ width: `${(route.currentPassengers / route.capacity * 100)}%` }}
                                            />
                                        </div>
                                        <div className="capacity-label">
                                            <span className="capacity-val">{route.currentPassengers}</span>/{route.capacity} seats
                                        </div>
                                    </div>

                                    <div className="route-hours">
                                        <span>First: <span>{route.firstBus}</span></span>
                                        <span>Last: <span>{route.lastBus}</span></span>
                                    </div>

                                    <button
                                        className="btn btn-secondary track-btn"
                                        onClick={() => toast.success(`📍 Tracking ${route.name}... Live location enabled!`)}
                                    >
                                        📡 Track Live Location
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
