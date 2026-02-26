import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import '../styles/canteen.css'

const API = 'http://localhost:5000/api'

const MENU_EMOJIS = {
    dosa: '🥞', biryani: '🍛', burger: '🍔', tikka: '🍖',
    coffee: '☕', samosa: '🫓', rajma: '🍲', thali: '🍱',
    maggi: '🍜', paratha: '🫓', rice: '🍚', noodles: '🍜',
    tea: '☕', egg: '🍳', chole: '🥘', vadapav: '🍔',
    poha: '🥣', paneer: '🥘', naan: '🫓', juice: '🥤'
}

const CATEGORY_BG = {
    'South Indian': 'linear-gradient(135deg, #fef9c3, #fef3c7)',
    'Main Course': 'linear-gradient(135deg, #fee2e2, #fecaca)',
    'Fast Food': 'linear-gradient(135deg, #fef9c3, #fed7aa)',
    'Starters': 'linear-gradient(135deg, #dcfce7, #d1fae5)',
    'Beverages': 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    'Snacks': 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    'Thali': 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
}

export default function Canteen() {
    const [menu, setMenu] = useState([])
    const [filtered, setFiltered] = useState([])
    const [category, setCategory] = useState('All')
    const [selectedCanteen, setSelectedCanteen] = useState('All')
    const [cart, setCart] = useState([])
    const [kitchenStatus, setKitchenStatus] = useState({ isOpen: true, avgWaitTime: 12, activeOrders: 5, currentLoad: 'medium', announcement: '' })
    const [orderConfirm, setOrderConfirm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const [menuRes, kitchenRes] = await Promise.all([
                    axios.get(`${API}/canteen/menu`),
                    axios.get(`${API}/canteen/kitchen-status`)
                ])
                setMenu(menuRes.data.data)
                setFiltered(menuRes.data.data)
                setKitchenStatus(kitchenRes.data.data)
            } catch { /* use fallback */ } finally { setLoading(false) }
        }
        fetchMenu()
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`${API}/canteen/kitchen-status`)
                setKitchenStatus(res.data.data)
            } catch { }
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    const canteens = ['All', 'Bhaiya Canteen', 'Nescafe', 'All is Well']
    const categories = ['All', ...new Set(menu.map(i => i.category))]

    const filterMenu = (cat, can) => {
        const c = cat || category
        const n = can || selectedCanteen
        setCategory(c)
        setSelectedCanteen(n)

        let temp = [...menu]
        if (c !== 'All') temp = temp.filter(i => i.category === c)
        if (n !== 'All') temp = temp.filter(i => i.canteen === n)
        setFiltered(temp)
    }

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === item.id)
            if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
            return [...prev, { ...item, qty: 1 }]
        })
        toast.success(`${item.name} added to cart!`, { icon: '🛒' })
    }

    const updateQty = (id, delta) => {
        setCart(prev => {
            const updated = prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
            return updated.filter(c => c.qty > 0)
        })
    }

    const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id))

    const getCartQty = (id) => cart.find(c => c.id === id)?.qty || 0

    const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
    const maxPrepTime = cart.reduce((max, c) => Math.max(max, c.prepTime || 10), 0)

    const placeOrder = async () => {
        if (cart.length === 0) return toast.error('Cart is empty!')
        setPlacing(true)
        try {
            const items = cart.map(c => ({ menuItemId: c.id, quantity: c.qty, name: c.name }))
            const res = await axios.post(`${API}/canteen/orders`, {
                items, studentName: 'Anmol Kumar', studentId: 'CS21B001', paymentMethod: 'campus-wallet'
            })
            setOrderConfirm(res.data.data)
            setCart([])
            toast.success('Order placed successfully! 🎉')
        } catch {
            toast.error('Failed to place order. Try again.')
        } finally { setPlacing(false) }
    }

    return (
        <main className="page-wrapper canteen-page">
            <div className="container">
                {/* Header */}
                <div className="page-header animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span style={{ fontSize: 40 }}>🍽️</span>
                        <div>
                            <h1 className="section-title">Campus Canteen</h1>
                            <p className="section-subtitle" style={{ marginBottom: 0 }}>Pre-order your meals • Skip the queue • Real-time kitchen status</p>
                        </div>
                    </div>
                </div>

                {/* Kitchen Status Bar */}
                <div className="kitchen-status-bar animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="kitchen-live-indicator">
                        <span className={`live-dot ${kitchenStatus.isOpen ? '' : 'offline'}`} />
                        {kitchenStatus.isOpen ? 'Kitchen Live' : 'Closed'}
                    </div>
                    <div className="kitchen-metrics-bar">
                        <div className="kitchen-bar-metric">
                            ⏱️ Avg Wait: <strong>{kitchenStatus.avgWaitTime} min</strong>
                        </div>
                        <div className="kitchen-bar-metric">
                            📦 Active: <strong>{kitchenStatus.activeOrders} orders</strong>
                        </div>
                        <div className="kitchen-bar-metric">
                            Load: <span className={`load-badge load-${kitchenStatus.currentLoad}`}>{kitchenStatus.currentLoad}</span>
                        </div>
                        {kitchenStatus.announcement && (
                            <div className="kitchen-bar-metric" style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>
                                📢 {kitchenStatus.announcement}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Layout */}
                <div className="canteen-layout">
                    {/* Menu Section */}
                    <div className="menu-section">
                        <div className="menu-header">
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Today's Menu</h2>
                            <div className="category-tabs">
                                {categories.map(cat => (
                                    <button key={cat} className={`cat-tab ${category === cat ? 'active' : ''}`} onClick={() => filterMenu(cat, null)}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="menu-header" style={{ marginTop: '20px' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Choose Canteen</h2>
                            <div className="category-tabs">
                                {canteens.map(can => (
                                    <button key={can} className={`cat-tab ${selectedCanteen === can ? 'active' : ''}`} style={{ borderColor: 'var(--accent)' }} onClick={() => filterMenu(null, can)}>
                                        {can}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }} />
                                ))}
                            </div>
                        ) : (
                            <div className="menu-grid">
                                {filtered.map((item, idx) => {
                                    const qty = getCartQty(item.id)
                                    return (
                                        <div className={`menu-item-card animate-fade-in-up ${!item.available ? 'unavailable' : ''}`}
                                            key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                                            <div className="menu-item-image" style={{ background: CATEGORY_BG[item.category] || 'var(--gray-50)' }}>
                                                <span>{MENU_EMOJIS[item.image] || '🍴'}</span>
                                                {!item.available && (
                                                    <div className="menu-item-badge">
                                                        <span className="badge badge-gray">Unavailable</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="menu-item-body">
                                                <div className="menu-item-name">{item.name}</div>
                                                <div className="menu-item-cat">{item.category} • <span style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>{item.canteen}</span></div>
                                                <div className="menu-item-meta">
                                                    <div className="menu-item-price">₹{item.price}</div>
                                                    <div className="menu-item-rating">⭐ {item.rating}</div>
                                                </div>
                                                <div className="menu-item-info">
                                                    <span>⏱️ {item.prepTime}m</span>
                                                    <span>🔥 {item.calories} cal</span>
                                                </div>
                                                {item.available ? (
                                                    qty === 0 ? (
                                                        <button className="btn btn-primary menu-item-add" onClick={() => addToCart(item)}>
                                                            + Add to Cart
                                                        </button>
                                                    ) : (
                                                        <div className="qty-control">
                                                            <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                                                            <span className="qty-value">{qty}</span>
                                                            <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <button className="btn btn-ghost menu-item-add" disabled>Not Available</button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Cart Panel */}
                    <div className="cart-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="cart-header">
                            <div className="cart-title">
                                🛒 Your Cart
                                <span className="cart-count-badge">{cart.length} items</span>
                            </div>
                        </div>

                        {cart.length === 0 ? (
                            <div className="cart-empty">
                                <div className="cart-empty-icon">🛒</div>
                                <p>Your cart is empty</p>
                                <p style={{ fontSize: 13, marginTop: 4 }}>Add delicious items from the menu!</p>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div className="cart-item" key={item.id}>
                                            <span className="cart-item-emoji">{MENU_EMOJIS[item.image] || '🍴'}</span>
                                            <div className="cart-item-info">
                                                <div className="cart-item-name">{item.name}</div>
                                                <div className="cart-item-price">₹{item.price} × {item.qty} = <strong>₹{item.price * item.qty}</strong></div>
                                            </div>
                                            <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div className="cart-summary-row">
                                        <span>Subtotal ({cart.reduce((s, c) => s + c.qty, 0)} items)</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <div className="cart-summary-row">
                                        <span>Campus Wallet Discount</span>
                                        <span style={{ color: 'var(--success)' }}>-₹0</span>
                                    </div>
                                    <div className="divider" style={{ margin: '12px 0' }} />
                                    <div className="cart-summary-row cart-summary-total">
                                        <span>Total</span>
                                        <span>₹<span>{cartTotal}</span></span>
                                    </div>
                                </div>

                                <div className="cart-eta">
                                    ⏱️ Ready in approximately <strong style={{ marginLeft: 4 }}>{maxPrepTime + kitchenStatus.avgWaitTime} minutes</strong>
                                </div>

                                <div className="cart-actions">
                                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                                        onClick={placeOrder} disabled={placing}>
                                        {placing ? '⏳ Placing Order...' : `🍽️ Place Order • ₹${cartTotal}`}
                                    </button>
                                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                                        onClick={() => setCart([])}>
                                        Clear Cart
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Confirmation Modal */}
            {orderConfirm && (
                <div className="modal-overlay" onClick={() => setOrderConfirm(null)}>
                    <div className="modal-content order-confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>🎉 Order Confirmed!</div>
                            <button className="close-btn" onClick={() => setOrderConfirm(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 64, marginBottom: 8 }}>✅</div>
                                <p style={{ color: 'var(--gray-600)', marginBottom: 8 }}>Your order has been placed</p>
                                <div className="order-number">{orderConfirm.orderNumber}</div>
                            </div>
                            <div className="order-eta-display">
                                <div className="eta-label">Estimated Pickup Time</div>
                                <div className="eta-time">{maxPrepTime + 5}m</div>
                                <div className="eta-label" style={{ marginTop: 4 }}>Ready at {new Date(orderConfirm.estimatedReady).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div style={{ padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Order Summary</p>
                                {orderConfirm.items?.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gray-600)', padding: '4px 0' }}>
                                        <span>{item.name} × {item.quantity}</span>
                                    </div>
                                ))}
                                <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 8, paddingTop: 8, fontWeight: 700, fontSize: 15, display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Total Paid</span>
                                    <span style={{ color: 'var(--primary)' }}>₹{orderConfirm.total}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => setOrderConfirm(null)}>
                                Track Order →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
