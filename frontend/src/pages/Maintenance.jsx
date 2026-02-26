import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/maintenance.css'

const API = 'http://localhost:5000/api'

const ISSUE_TYPES = [
    { key: 'Electricity', emoji: '⚡', label: 'Electricity' },
    { key: 'Plumbing', emoji: '🚿', label: 'Plumbing' },
    { key: 'Cleanliness', emoji: '🧹', label: 'Cleanliness' },
    { key: 'Internet', emoji: '📶', label: 'Internet' },
    { key: 'Civil', emoji: '🏗️', label: 'Civil' },
    { key: 'Other', emoji: '🔧', label: 'Other' },
]

const getPriorityColor = (p) => ({ high: '#ef4444', medium: '#f59e0b', low: '#10b981' }[p] || '#94a3b8')
const getStatusClass = (s) => ({ pending: 'status-pending', 'in-progress': 'status-in-progress', resolved: 'status-resolved', rejected: 'status-rejected' }[s] || '')
const PRIORITY_MAP = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }

const timeAgo = (date) => {
    const d = Math.floor((Date.now() - new Date(date)) / 1000)
    if (d < 60) return `${d}s ago`
    if (d < 3600) return `${Math.floor(d / 60)}m ago`
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`
    return `${Math.floor(d / 86400)}d ago`
}

export default function Maintenance() {
    const [issues, setIssues] = useState([])
    const [filtered, setFiltered] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [gpsLocation, setGpsLocation] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [form, setForm] = useState({ type: '', title: '', location: '', description: '', priority: 'medium', reportedBy: 'Anmol Kumar' })
    const fileRef = useRef()

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await axios.get(`${API}/maintenance/issues`)
                setIssues(res.data.data)
                setFiltered(res.data.data)
            } catch { } finally { setLoading(false) }
        }
        fetchIssues()
    }, [])

    const applyFilter = (f) => {
        setFilter(f)
        setFiltered(f === 'all' ? issues : issues.filter(i => i.status === f))
    }

    const getGPS = () => {
        if (!navigator.geolocation) return toast.error('Geolocation not supported')
        navigator.geolocation.getCurrentPosition(pos => {
            setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            toast.success('Location captured!')
        }, () => {
            setGpsLocation({ lat: 28.6139, lng: 77.2090 })
            toast.success('Using approximate campus location')
        })
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
        if (!form.type) return toast.error('Please select an issue type')
        if (!form.title || !form.location) return toast.error('Please fill all required fields')
        setSubmitting(true)
        try {
            const fd = new FormData()
            Object.entries({ ...form, ...(gpsLocation || {}) }).forEach(([k, v]) => fd.append(k, v))
            if (fileRef.current?.files[0]) fd.append('photo', fileRef.current.files[0])
            const res = await axios.post(`${API}/maintenance/issues`, fd)
            const newIssue = res.data.data
            setIssues(prev => [newIssue, ...prev])
            setFiltered(prev => [newIssue, ...prev])
            setForm({ type: '', title: '', location: '', description: '', priority: 'medium', reportedBy: 'Anmol Kumar' })
            setGpsLocation(null)
            setPhotoPreview(null)
            toast.success('Issue reported successfully! 🎉')
        } catch { toast.error('Failed to report issue. Try again.') }
        finally { setSubmitting(false) }
    }

    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status === 'pending').length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        resolved: issues.filter(i => i.status === 'resolved').length,
    }

    return (
        <main className="page-wrapper maintenance-page">
            <div className="container">
                <div className="page-header animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span style={{ fontSize: 40 }}>🔧</span>
                        <div>
                            <h1 className="section-title">Maintenance & Reporting</h1>
                            <p className="section-subtitle" style={{ marginBottom: 0 }}>Report issues with photo + GPS • Track resolution status</p>
                        </div>
                    </div>
                </div>

                <div className="maintenance-stats animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {[
                        { label: 'Total Issues', val: stats.total, color: 'var(--primary)' },
                        { label: '⏳ Pending', val: stats.pending, color: '#f59e0b' },
                        { label: '🔄 In Progress', val: stats.inProgress, color: '#3b82f6' },
                        { label: '✅ Resolved', val: stats.resolved, color: '#10b981' },
                    ].map((s, i) => (
                        <div className="maint-stat" key={i}>
                            <div className="maint-stat-val" style={{ color: s.color }}>{s.val}</div>
                            <div className="maint-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="maintenance-layout">
                    {/* Issues List */}
                    <div>
                        <div className="filter-bar">
                            {['all', 'pending', 'in-progress', 'resolved'].map(f => (
                                <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => applyFilter(f)}>
                                    {f === 'all' ? 'All Issues' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-xl)' }} />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <p>No issues found</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {filtered.map((issue, idx) => {
                                    const typeInfo = ISSUE_TYPES.find(t => t.key === issue.type)
                                    return (
                                        <div className={`issue-card priority-${issue.priority} animate-fade-in-up`} key={issue.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                                            <div className="issue-card-header">
                                                <div className="issue-type-icon" style={{ background: issue.priority === 'high' ? '#fee2e2' : issue.priority === 'medium' ? '#fef9c3' : '#dcfce7' }}>
                                                    {typeInfo?.emoji || '🔧'}
                                                </div>
                                                <div className="issue-title">{issue.title}</div>
                                                <div className="issue-badges">
                                                    <span className={`badge ${getStatusClass(issue.status)}`}>{issue.status}</span>
                                                    <span style={{ fontSize: 12, fontWeight: 600, color: getPriorityColor(issue.priority) }}>{PRIORITY_MAP[issue.priority]}</span>
                                                </div>
                                            </div>
                                            <div className="issue-location">📍 {issue.location}</div>
                                            {issue.description && <div className="issue-desc">{issue.description}</div>}
                                            {issue.updates?.length > 0 && (
                                                <div className="issue-updates">
                                                    {issue.updates.map((u, i) => <div className="issue-update-item" key={i}>{u}</div>)}
                                                </div>
                                            )}
                                            <div className="issue-footer">
                                                <div className="issue-reporter">👤 {issue.reportedBy}</div>
                                                <div className="issue-time">🕐 {timeAgo(issue.createdAt)}</div>
                                                {issue.lat && <span className="badge badge-secondary">📍 GPS Tagged</span>}
                                                {issue.photo && <span className="badge badge-primary">📷 Photo</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Report Form */}
                    <div className="report-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="report-panel-header">
                            <h3>📋 Report New Issue</h3>
                            <p>Help us improve campus facilities</p>
                        </div>
                        <div className="report-form-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Issue Type *</label>
                                    <div className="type-selector">
                                        {ISSUE_TYPES.map(t => (
                                            <div key={t.key} className={`type-option ${form.type === t.key ? 'selected' : ''}`}
                                                onClick={() => setForm(p => ({ ...p, type: t.key }))}>
                                                <span className="type-emoji">{t.emoji}</span>
                                                {t.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input className="form-input" placeholder="Brief description of the issue" required
                                        value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Location *</label>
                                    <input className="form-input" placeholder="e.g. Library Room 204, Gate 3" required
                                        value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input form-textarea" placeholder="Additional details..."
                                        value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select className="form-select" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                                        <option value="low">🟢 Low</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="high">🔴 High</option>
                                    </select>
                                </div>

                                {/* GPS */}
                                <div className="form-group">
                                    <label className="form-label">GPS Location</label>
                                    <div className={`gps-picker ${gpsLocation ? 'active' : ''}`} onClick={getGPS}>
                                        <span className="gps-icon">📍</span>
                                        <div className="gps-text">
                                            <strong>{gpsLocation ? 'Location Captured ✓' : 'Tap to pin location'}</strong>
                                            <small>{gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : 'GPS helps faster resolution'}</small>
                                        </div>
                                    </div>
                                </div>

                                {/* Photo Upload */}
                                <div className="form-group">
                                    <label className="form-label">Attach Photo</label>
                                    <div className={`photo-upload-area ${photoPreview ? 'has-photo' : ''}`}
                                        onClick={() => fileRef.current?.click()}>
                                        <input type="file" ref={fileRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                                        {photoPreview ? (
                                            <>
                                                <img src={photoPreview} alt="Preview" className="photo-preview" />
                                                <p style={{ marginTop: 8, fontSize: 13, color: 'var(--success)' }}>✅ Photo selected</p>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                                                <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>Click to upload photo</p>
                                                <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Max 10MB • JPG, PNG, HEIC</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                                    {submitting ? '⏳ Reporting...' : '🚨 Report Issue'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
