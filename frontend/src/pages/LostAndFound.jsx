import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/lostandfound.css'

const API = 'http://localhost:5000/api'

const CATEGORIES = [
    { key: 'Bags', emoji: '🎒' },
    { key: 'Electronics', emoji: '📱' },
    { key: 'Documents', emoji: '📄' },
    { key: 'Personal Items', emoji: '🔑' },
    { key: 'Clothing', emoji: '👕' },
    { key: 'Other', emoji: '📦' },
]

const ITEM_EMOJIS = { Bags: '🎒', Electronics: '📱', Documents: '📄', 'Personal Items': '🔑', Clothing: '👕', Other: '📦' }

const timeAgo = (date) => {
    const d = Math.floor((Date.now() - new Date(date)) / 1000)
    if (d < 60) return `${d}s ago`
    if (d < 3600) return `${Math.floor(d / 60)}m ago`
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`
    return `${Math.floor(d / 86400)}d ago`
}

export default function LostAndFound() {
    const [items, setItems] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeTab, setActiveTab] = useState('all')
    const [formType, setFormType] = useState('lost')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [potentialMatches, setPotentialMatches] = useState([])
    const [form, setForm] = useState({ title: '', description: '', location: '', reportedBy: 'Ritesh Kumar', contact: 'riteshkumar90359@gmail.com', category: '' })
    const fileRef = useRef()

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get(`${API}/lostandfound/items`)
                setItems(res.data.data)
                setFiltered(res.data.data)
            } catch { } finally { setLoading(false) }
        }
        fetchItems()
    }, [])

    const applyTab = (tab) => {
        setActiveTab(tab)
        setFiltered(tab === 'all' ? items : items.filter(i => i.type === tab))
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => setPhotoPreview(reader.result)
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title || !form.location) return toast.error('Fill all required fields')
        setSubmitting(true)
        try {
            const fd = new FormData()
            Object.entries({ ...form, type: formType }).forEach(([k, v]) => fd.append(k, v))
            if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0])
            const res = await axios.post(`${API}/lostandfound/items`, fd)
            const { data: newItem, potentialMatches: matches } = res.data
            setItems(prev => [newItem, ...prev])
            applyTab(activeTab)
            if (matches?.length > 0) {
                setPotentialMatches(matches)
                toast.success(`🎉 Potential match found! ${matches.length} item(s) might be yours!`)
            } else {
                toast.success(`${formType === 'lost' ? '🔍 Lost item reported!' : '✅ Found item reported! We\'ll notify the owner.'}`)
            }
            setForm({ title: '', description: '', location: '', reportedBy: 'Ritesh Kumar', contact: 'riteshkumar90359@gmail.com', category: '' })
            setPhotoPreview(null)
        } catch { toast.error('Failed to submit. Try again.') }
        finally { setSubmitting(false) }
    }

    const stats = {
        lost: items.filter(i => i.type === 'lost' && i.status === 'active').length,
        found: items.filter(i => i.type === 'found' && i.status === 'active').length,
        reunited: items.filter(i => i.status === 'claimed').length,
    }

    return (
        <main className="page-wrapper lf-page">
            <div className="container">
                <div className="page-header animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span style={{ fontSize: 40 }}>🔍</span>
                        <div>
                            <h1 className="section-title">Lost & Found</h1>
                            <p className="section-subtitle" style={{ marginBottom: 0 }}>Report lost items • Auto-match when found • Real-time notifications</p>
                        </div>
                    </div>
                </div>

                <div className="lf-stats animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="lf-stat">
                        <div className="lf-stat-val" style={{ color: 'var(--danger)' }}>{stats.lost}</div>
                        <div className="lf-stat-label">🔴 Lost Items</div>
                    </div>
                    <div className="lf-stat">
                        <div className="lf-stat-val" style={{ color: 'var(--success)' }}>{stats.found}</div>
                        <div className="lf-stat-label">🟢 Found Items</div>
                    </div>
                    <div className="lf-stat">
                        <div className="lf-stat-val" style={{ color: 'var(--primary)' }}>{stats.reunited}</div>
                        <div className="lf-stat-label">🤝 Reunited</div>
                    </div>
                </div>

                {/* Match Alert */}
                {potentialMatches.length > 0 && (
                    <div className="match-alert animate-scale-in" style={{ marginBottom: 24 }}>
                        <span style={{ fontSize: 24 }}>🎯</span>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: 14 }}>Potential Match Found!</div>
                            <div style={{ fontSize: 13, color: '#166534' }}>{potentialMatches.length} item(s) in our database might match. Contact the reporters!</div>
                        </div>
                        <button onClick={() => setPotentialMatches([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontSize: 18 }}>✕</button>
                    </div>
                )}

                <div className="lf-tab-switcher">
                    <button className={`lf-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => applyTab('all')}>All Items</button>
                    <button className={`lf-tab lost ${activeTab === 'lost' ? 'active' : ''}`} onClick={() => applyTab('lost')}>🔴 Lost</button>
                    <button className={`lf-tab found ${activeTab === 'found' ? 'active' : ''}`} onClick={() => applyTab('found')}>🟢 Found</button>
                </div>

                <div className="lf-layout">
                    {/* Items Grid */}
                    <div>
                        {loading ? (
                            <div className="lf-items-grid">
                                {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }} />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">🔍</div><p>No items found</p></div>
                        ) : (
                            <div className="lf-items-grid">
                                {filtered.map((item, idx) => (
                                    <div className={`lf-item-card ${item.type} animate-fade-in-up`} key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                                        <div className="lf-item-image">
                                            {item.image ? <img src={`http://localhost:5000${item.image}`} alt={item.title} /> : <span>{ITEM_EMOJIS[item.category] || '📦'}</span>}
                                            <span className={`lf-type-badge type-${item.type}`}>{item.type}</span>
                                        </div>
                                        <div className="lf-item-body">
                                            <div className="lf-item-title">{item.title}</div>
                                            <div className="lf-item-desc">{item.description}</div>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                                                <span className="badge badge-gray">{item.category}</span>
                                                {item.status === 'claimed' && <span className="badge badge-success">Reunited ✓</span>}
                                            </div>
                                            <div className="lf-item-meta">
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 12 }}>📍 {item.location}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{timeAgo(item.createdAt)}</div>
                                                </div>
                                                {item.status === 'active' && (
                                                    <a href={`mailto:${item.contact}`} className="lf-contact-btn">Contact →</a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Panel */}
                    <div className="lf-form-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* Type Switcher */}
                        <div style={{ display: 'flex', gap: 0 }}>
                            <button onClick={() => setFormType('lost')}
                                className={`lf-form-header ${formType === 'lost' ? 'lost-header' : ''}`}
                                style={{ flex: 1, border: 'none', cursor: 'pointer', textAlign: 'center', padding: '16px', borderRadius: 0 }}>
                                <div style={{ fontSize: 20 }}>😢</div>
                                <h3 style={{ margin: 0 }}>Lost Item</h3>
                            </button>
                            <button onClick={() => setFormType('found')}
                                className={`lf-form-header ${formType === 'found' ? 'found-header' : ''}`}
                                style={{ flex: 1, border: 'none', cursor: 'pointer', textAlign: 'center', padding: '16px', background: formType === 'found' ? undefined : 'var(--gray-100)', borderRadius: 0 }}>
                                <div style={{ fontSize: 20 }}>😊</div>
                                <h3 style={{ margin: 0, color: formType === 'found' ? 'white' : 'var(--gray-700)' }}>Found Item</h3>
                            </button>
                        </div>

                        <div className="lf-form-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <div className="category-grid">
                                        {CATEGORIES.map(c => (
                                            <div key={c.key} className={`category-btn ${form.category === c.key ? 'selected' : ''}`}
                                                onClick={() => setForm(p => ({ ...p, category: c.key }))}>
                                                <span className="cat-emoji">{c.emoji}</span>
                                                {c.key}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Item Name *</label>
                                    <input className="form-input" placeholder="e.g. Blue Nike Backpack" required
                                        value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input form-textarea" placeholder="Color, brand, unique features..."
                                        value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Location {formType === 'lost' ? 'Lost' : 'Found'} *</label>
                                    <input className="form-input" placeholder="e.g. Library, Sports Complex" required
                                        value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Your Contact</label>
                                    <input className="form-input" placeholder="Email or phone" type="email"
                                        value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
                                </div>

                                {/* Photo */}
                                <div className="form-group">
                                    <label className="form-label">Item Photo</label>
                                    <div className={`photo-upload-area ${photoPreview ? 'has-photo' : ''}`} onClick={() => fileRef.current?.click()}>
                                        <input type="file" ref={fileRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="photo-preview" />
                                        ) : (
                                            <>
                                                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                                                <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Upload photo (helps matching!)</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button type="submit"
                                    className={`btn ${formType === 'lost' ? 'btn-danger' : 'btn-success'}`}
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    disabled={submitting}>
                                    {submitting ? '⏳ Submitting...' : formType === 'lost' ? '🔍 Report Lost Item' : '✅ Report Found Item'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
