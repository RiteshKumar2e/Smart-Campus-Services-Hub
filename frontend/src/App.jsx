import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Canteen from './pages/Canteen'
import Maintenance from './pages/Maintenance'
import LostAndFound from './pages/LostAndFound'
import Events from './pages/Events'
import CampusMap from './pages/CampusMap'
import Transport from './pages/Transport'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      {/* ... Toaster part stays ... */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1a1a2e',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/canteen" element={<><Navbar /><Canteen /></>} />
        <Route path="/maintenance" element={<><Navbar /><Maintenance /></>} />
        <Route path="/lost-found" element={<><Navbar /><LostAndFound /></>} />
        <Route path="/events" element={<><Navbar /><Events /></>} />
        <Route path="/map" element={<><Navbar /><CampusMap /></>} />
        <Route path="/transport" element={<><Navbar /><Transport /></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
