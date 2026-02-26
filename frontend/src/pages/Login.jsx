import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import '../styles/auth.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            toast.success('Login Successful! Welcome back.')
            setTimeout(() => navigate('/dashboard'), 1000)
        }, 1500)
    }

    return (
        <div className="auth-page">
            <Link to="/" className="auth-back-home">
                <span>←</span> Back to Home
            </Link>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🎓</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to access campus services</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="auth-input-group">
                        <label className="auth-label">Campus Email</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">📧</span>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="name@campus.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🔒</span>
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

                    <div className="auth-options">
                        <label className="auth-remember">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="auth-forgot">Forgot Password?</a>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider">Or continue with</div>

                <div className="social-auth">
                    <button className="social-btn">
                        <img src="https://www.svgrepo.com/show/355037/google.svg" width="18" alt="Google" />
                        Google
                    </button>
                    <button className="social-btn">
                        <img src="https://www.svgrepo.com/show/448234/microsoft.svg" width="18" alt="Microsoft" />
                        Outlook
                    </button>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Register Now</Link>
                </div>
            </div>
        </div>
    )
}
