import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/map.css'

const API = 'http://localhost:5000/api'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const TYPE_DOTS = {
    academic: '#6366f1', library: '#8b5cf6', department: '#0ea5e9',
    hostel: '#10b981', sports: '#f59e0b', activity: '#ec4899',
    food: '#ef4444', health: '#14b8a6', admin: '#64748b'
}

const createCustomIcon = (color) => L.divIcon({
    html: `<div style="
    width:28px;height:28px;background:${color};
    border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);
  "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: ''
})

const youAreHereIcon = L.divIcon({
    html: `<div style="
    width:20px;height:20px;background:#6366f1;border-radius:50%;
    border:3px solid white;box-shadow:0 0 0 6px rgba(99,102,241,0.25),0 4px 12px rgba(0,0,0,0.2);
    animation: pulse-ring 1.5s infinite;
  "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: ''
})

const CAMPUS_CENTER = [22.8119, 86.0199]

const universityIcon = L.divIcon({
    className: 'google-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    html: '<div></div>'
})

function FlyToMarker({ position, zoom = 18 }) {
    const map = useMap()
    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom, {
                duration: 1.5,
                easeLinearity: 0.25
            })
        }
    }, [position, map, zoom])
    return null
}

export default function CampusMap() {
    const [buildings, setBuildings] = useState([])
    const [selected, setSelected] = useState(null)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [userLocation] = useState(CAMPUS_CENTER)
    const [destination, setDestination] = useState(null)
    const [route, setRoute] = useState(null)
    const [flyTo, setFlyTo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const res = await axios.get(`${API}/map/buildings`)
                setBuildings(res.data.data)
                if (res.data.data.length > 0) {
                    setSelected(res.data.data[0])
                }
            } catch { } finally { setLoading(false) }
        }
        fetchBuildings()
    }, [])

    const filtered = buildings.filter(b => {
        const matchType = typeFilter === 'all' || b.type === typeFilter
        const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase())
        return matchType && matchSearch
    })

    const selectBuilding = (building) => {
        setSelected(building)
        setFlyTo({ position: [building.lat, building.lng], zoom: 18 })
    }

    const getDirections = (building) => {
        setDestination(building)
        const steps = [
            `Start from your current location`,
            `Head towards ${building.name}`,
            `Follow the main campus path`,
            `Arrive at ${building.name} (${building.floors} floors)`,
        ]
        setRoute({ steps, distance: `~${(Math.random() * 0.4 + 0.1).toFixed(1)} km`, time: `~${Math.floor(Math.random() * 8 + 2)} min` })
        setFlyTo({ position: [building.lat, building.lng], zoom: 18 })
        toast.success(`📍 Route to ${building.name} ready!`)
    }

    const types = ['all', ...new Set(buildings.map(b => b.type))]

    return (
        <main className="page-wrapper map-page">
            <div className="container">
                <div className="page-header animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span style={{ fontSize: 40 }}>🗺️</span>
                        <div>
                            <h1 className="section-title">Arka Jain University Map</h1>
                            <p className="section-subtitle" style={{ marginBottom: 0 }}>Smart pathfinding for Gamharia Campus • Real-time info</p>
                        </div>
                    </div>
                </div>

                <div className="map-layout">
                    {/* Sidebar */}
                    <div className="map-sidebar">
                        {/* Search */}
                        <div className="map-search-panel animate-fade-in-up">
                            <div className="search-wrapper" style={{ maxWidth: '100%', marginBottom: 16 }}>
                                <span className="search-icon">🔍</span>
                                <input className="search-input" placeholder="Search buildings..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                                {types.map(t => (
                                    <button key={t} className={`filter-chip ${typeFilter === t ? 'active' : ''}`} style={{ padding: '5px 12px', fontSize: 12 }}
                                        onClick={() => setTypeFilter(t)}>
                                        {t === 'all' ? 'All' : t}
                                    </button>
                                ))}
                            </div>
                            <div className="map-building-list">
                                {loading ? (
                                    [...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }} />)
                                ) : filtered.map(b => (
                                    <div key={b.id}
                                        className={`map-building-item ${selected?.id === b.id ? 'selected' : ''}`}
                                        onClick={() => selectBuilding(b)}>
                                        <div className="building-type-dot" style={{ background: TYPE_DOTS[b.type] || '#94a3b8' }} />
                                        <div className="building-info">
                                            <div className="building-name">{b.name}</div>
                                            <div className="building-type-label">{b.type}</div>
                                        </div>
                                        <button
                                            style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s' }}
                                            title="Get directions"
                                            onClick={e => { e.stopPropagation(); getDirections(b) }}>
                                            🧭
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected Building Detail */}
                        {selected && (
                            <div className="building-detail-panel google-style-card animate-scale-in">
                                <div className="card-media">
                                    <img src={selected.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800&q=80'} alt={selected.name} />
                                    <button className="close-card-btn" onClick={() => setSelected(null)}>✕</button>
                                </div>
                                <div className="card-content">
                                    <div className="card-header-row">
                                        <h2 className="card-title-main">{selected.name}</h2>
                                        <div className="card-actions-mini">
                                            <div className="action-circle-btn" onClick={() => getDirections(selected)}><span style={{ fontSize: 18 }}>🧭</span></div>
                                            <div className="action-circle-btn"><span style={{ fontSize: 18 }}>🔖</span></div>
                                        </div>
                                    </div>
                                    <div className="card-rating-row">
                                        <span className="rating-val">3.9</span>
                                        <span className="rating-stars">★★★★☆</span>
                                        <span className="rating-count">(1,003)</span>
                                    </div>
                                    <div className="card-meta-row">
                                        <span className="meta-type">{selected.type === 'food' ? 'Restaurant' : 'Educational institution'}</span>
                                        <span className="meta-sep">·</span>
                                        <span className="meta-status">Open · Closes 7 pm</span>
                                    </div>
                                    <div className="card-description-row">
                                        <p>{selected.description}</p>
                                    </div>
                                    <div className="card-footer-btns">
                                        <button className="btn-gm-directions" onClick={() => getDirections(selected)}>
                                            <span style={{ marginRight: 6 }}>🧭</span> Directions
                                        </button>
                                        <button className="btn-gm-share">
                                            <span style={{ marginRight: 6 }}>📤</span> Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Route Panel */}
                        {route && destination && (
                            <div className="route-panel animate-scale-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: 14 }}>🧭 Route to {destination.name}</div>
                                    <button onClick={() => { setRoute(null); setDestination(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d' }}>✕</button>
                                </div>
                                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#166534', marginBottom: 12 }}>
                                    <span>📏 {route.distance}</span>
                                    <span>⏱️ {route.time} walk</span>
                                </div>
                                <div className="route-steps">
                                    {route.steps.map((step, i) => (
                                        <div className="route-step" key={i}>
                                            <div className="route-step-num">{i + 1}</div>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    <div className="map-container animate-fade-in-up" style={{ animationDelay: '0.15s', position: 'relative' }}>
                        {/* Mock Search this area button */}
                        <div className="search-area-overlay">
                            <button className="btn-search-area">
                                <span style={{ marginRight: 6 }}>🔍</span> Search this area
                            </button>
                        </div>

                        <div className="map-overlay-controls">
                            <button className="map-overlay-btn" title="Detailed Campus View"
                                onClick={() => setFlyTo({ position: [22.843, 86.102], zoom: 17 })}>
                                🏢
                            </button>
                            <button className="map-overlay-btn" title="City Overview"
                                onClick={() => setFlyTo({ position: [22.795, 86.150], zoom: 12 })}>
                                🌆
                            </button>
                            <button className="map-overlay-btn" onClick={() => navigateDetail(CAMPUS_CENTER)}>📍</button>
                        </div>

                        <MapContainer
                            center={[22.795, 86.150]}
                            zoom={12}
                            className="leaflet-map"
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />

                            {flyTo && <FlyToMarker position={flyTo.position} zoom={flyTo.zoom} />}

                            {/* User location */}
                            <CircleMarker
                                center={userLocation}
                                radius={10}
                                pathOptions={{ color: '#4f46e5', fillColor: '#6366f1', fillOpacity: 1, weight: 3 }}
                            >
                                <Popup>
                                    <div className="custom-popup">
                                        <h3>📍 You Are Here</h3>
                                        <p>Your current campus location</p>
                                    </div>
                                </Popup>
                            </CircleMarker>

                            {/* Route line */}
                            {destination && (
                                <Polyline
                                    positions={[userLocation, [destination.lat, destination.lng]]}
                                    pathOptions={{ color: '#6366f1', weight: 4, dashArray: '10,10', opacity: 0.8 }}
                                />
                            )}

                            {/* Buildings */}
                            {filtered.map(b => (
                                <Marker
                                    key={b.id}
                                    position={[b.lat, b.lng]}
                                    icon={universityIcon}
                                    eventHandlers={{ click: () => selectBuilding(b) }}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                                        <div className="premium-tooltip">{b.name.split(' ')[2] || b.name}</div>
                                    </Tooltip>
                                    <Popup>
                                        <div className="custom-popup" style={{ minWidth: 180 }}>
                                            <h3>{b.name}</h3>
                                            <p>{b.description}</p>
                                            <p style={{ marginTop: 6, color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}
                                                onClick={() => getDirections(b)}>🧭 Get Directions</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </main>
    )
}
