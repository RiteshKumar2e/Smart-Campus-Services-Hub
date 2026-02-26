import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Shield, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import '../styles/auth.css'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleAdminLogin = (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate Admin API call
        setTimeout(() => {
            setLoading(false)
            if (email === 'riteshkumar90359@gmail.com' && password === 'admin123') {
                toast.success('Admin Authentication Successful!')
                setTimeout(() => navigate('/dashboard'), 1000)
            } else {
                toast.error('Access Denied! Use riteshkumar90359@gmail.com / admin123')
            }
        }, 1500)
    }

    return (
        <div className="auth-page admin-auth-page">
            <Link to="/" className="back-to-home">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div className="auth-card">
                <div className="university-header">
                    <div className="logo-jgi" style={{ background: '#8e1e24' }}>AJU</div>
                    <div className="university-name-block">
                        <div className="uni-name-main">
                            Admin <span className="uni-name-highlight">Portal</span>
                        </div>
                        <div className="uni-name-main" style={{ fontSize: '14px', opacity: 0.8 }}>Security Control</div>
                        <div className="uni-location">Arka Jain University</div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '25px', padding: '0 10px' }}>
                    <div style={{ display: 'inline-flex', padding: '8px 16px', background: '#fff1f2', color: '#e11d48', borderRadius: '20px', fontSize: '12px', fontWeight: 600, alignItems: 'center', gap: 6 }}>
                        <Shield size={14} /> RESTRICTED ACCESS AREA
                    </div>
                </div>

                <form className="auth-form" onSubmit={handleAdminLogin}>
                    <div className="input-container">
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Admin E-mail Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="login-input"
                            placeholder="Security Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    <button type="submit" className="login-submit-btn" style={{ background: 'linear-gradient(to right, #1e293b, #475569)' }} disabled={loading}>
                        {loading ? 'Verifying Credentials...' : 'ENTER CONSOLE'}
                    </button>
                </form>

                <div className="auth-links" style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Unauthorized access attempts are monitored and logged.
                </div>

                <div className="auth-links" style={{ marginTop: '20px' }}>
                    Standard user? <Link to="/login">Go to Student Login</Link>
                </div>
            </div>
        </div>
    )
}
