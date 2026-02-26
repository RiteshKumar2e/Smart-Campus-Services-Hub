import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, RefreshCcw, ArrowLeft } from 'lucide-react'
import '../styles/auth.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captchaInput, setCaptchaInput] = useState('')
    const [generatedCaptcha, setGeneratedCaptcha] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const generateCaptchaText = () => {
        const chars = '0123456789'
        let text = ''
        for (let i = 0; i < 4; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setGeneratedCaptcha(text)
    }

    useEffect(() => {
        generateCaptchaText()
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()

        if (captchaInput !== generatedCaptcha) {
            toast.error('Invalid Captcha!')
            generateCaptchaText()
            setCaptchaInput('')
            return
        }

        setLoading(true)

        // Simulate API call with User Credentials
        setTimeout(() => {
            setLoading(false)
            if (email === 'riteshkumar90359@gmail.com' && password === 'student123') {
                toast.success('Login Successful! Welcome Ritesh.')
                setTimeout(() => navigate('/dashboard'), 1000)
            } else {
                toast.error('Invalid Credentials! Hint: riteshkumar90359@gmail.com / student123')
                generateCaptchaText()
            }
        }, 1500)
    }

    return (
        <div className="auth-page">
            <Link to="/" className="back-to-home">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div className="auth-card">
                <div className="university-header">
                    <div className="logo-jgi">JGi</div>
                    <div className="university-name-block">
                        <div className="uni-name-main">
                            Arka <span className="uni-name-highlight">Jain</span>
                        </div>
                        <div className="uni-name-main" style={{ fontSize: '15px' }}>University</div>
                        <div className="uni-location">Jharkhand</div>
                    </div>
                    <div className="naac-info">
                        <div className="naac-badge">NAAC GRADE A</div>
                    </div>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="input-container">
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    <div className="captcha-container">
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Enter Captcha"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            required
                        />
                        <div className="captcha-visual">
                            {generatedCaptcha}
                        </div>
                        <button type="button" className="captcha-refresh" onClick={generateCaptchaText} title="Refresh Captcha">
                            <RefreshCcw size={20} />
                        </button>
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'LOGIN'}
                    </button>
                </form>

                <div className="auth-links">
                    Don't have an account? <Link to="/register">Create User</Link>
                </div>
            </div>
        </div>
    )
}
