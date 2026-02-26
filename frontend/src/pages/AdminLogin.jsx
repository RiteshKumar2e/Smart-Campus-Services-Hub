import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Shield, Lock, Mail, ArrowLeft } from 'lucide-react'
import '../styles/auth.css'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleAdminLogin = (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate Admin API call
        setTimeout(() => {
            setLoading(false)
            if (email.includes('admin')) {
                toast.success('Admin Authentication Successful!')
                setTimeout(() => navigate('/dashboard'), 1000)
            } else {
                toast.error('Unauthorized: Admin access only.')
            }
        }, 1500)
    }

    return (
        <div className="auth-page admin-auth-page">
            <Link to="/" className="auth-back-home">
                <ArrowLeft size={18} /> Back to Home
            </Link>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo" style={{ background: 'var(--accent)', color: 'white' }}>
                        <Shield size={32} />
                    </div>
                    <h1 className="auth-title">Admin Console</h1>
                    <p className="auth-subtitle">Secure access for campus administrators</p>
                </div>

                <form className="auth-form" onSubmit={handleAdminLogin}>
                    <div className="auth-input-group">
                        <label className="auth-label">Admin Email</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon"><Mail size={18} /></span>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="admin@campus.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Security Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon"><Lock size={18} /></span>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit admin-submit" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter Console'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '20px' }}>
                        🛡️ Restricted Area: Unauthorized access attempts are logged.
                    </p>
                </div>
            </div>
        </div>
    )
}
