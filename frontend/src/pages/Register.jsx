import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import '../styles/auth.css'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match!')
        }

        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            toast.success('Registration Successful! Please login.')
            setTimeout(() => navigate('/login'), 1500)
        }, 1500)
    }

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '480px' }}>
                <div className="auth-header">
                    <div className="auth-logo">🎓</div>
                    <h1 className="auth-title">Join SmartCampus</h1>
                    <p className="auth-subtitle">Create your student account today</p>
                </div>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="auth-input-group">
                        <label className="auth-label">Full Name</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">👤</span>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Anmol Kumar"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="auth-input-group">
                            <label className="auth-label">Campus Email</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">📧</span>
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="name@campus.edu"
                                    style={{ paddingLeft: '38px' }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Student ID</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🆔</span>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="CS21B10"
                                    style={{ paddingLeft: '38px' }}
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Create Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🔒</span>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Confirm Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🛡️</span>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    )
}
