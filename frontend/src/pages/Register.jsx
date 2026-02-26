import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import '../styles/auth.css'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
            <Link to="/" className="back-to-home">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div className="auth-card" style={{ maxWidth: '520px' }}>
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

                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '20px', color: '#3c3b62', margin: 0 }}>Student Registration</h2>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Join the SmartCampus ecosystem</p>
                </div>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="input-container">
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Full Name (e.g. Ritesh Kumar)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Enrollment No. / Student ID (e.g. AJU/221403)"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="login-input"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    <div className="input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="login-input"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                        <div className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div className="auth-links">
                    Already have an account? <Link to="/login">Sign In Instead</Link>
                </div>
            </div>
        </div>
    )
}
