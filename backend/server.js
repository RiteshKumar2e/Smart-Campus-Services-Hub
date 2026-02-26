require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload dir exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ======================== IN-MEMORY DATA STORES ========================

let canteenMenu = [
  { id: '1', name: 'Masala Dosa', category: 'South Indian', price: 60, prepTime: 10, available: true, rating: 4.5, calories: 320, image: 'dosa' },
  { id: '2', name: 'Chicken Biryani', category: 'Main Course', price: 120, prepTime: 20, available: true, rating: 4.8, calories: 650, image: 'biryani' },
  { id: '3', name: 'Veg Burger', category: 'Fast Food', price: 80, prepTime: 8, available: true, rating: 4.2, calories: 450, image: 'burger' },
  { id: '4', name: 'Paneer Tikka', category: 'Starters', price: 100, prepTime: 15, available: true, rating: 4.6, calories: 380, image: 'tikka' },
  { id: '5', name: 'Cold Coffee', category: 'Beverages', price: 50, prepTime: 5, available: true, rating: 4.3, calories: 180, image: 'coffee' },
  { id: '6', name: 'Samosa (2pcs)', category: 'Snacks', price: 30, prepTime: 3, available: true, rating: 4.1, calories: 220, image: 'samosa' },
  { id: '7', name: 'Rajma Chawal', category: 'Main Course', price: 90, prepTime: 12, available: false, rating: 4.4, calories: 520, image: 'rajma' },
  { id: '8', name: 'Veg Thali', category: 'Thali', price: 110, prepTime: 15, available: true, rating: 4.7, calories: 800, image: 'thali' },
];

let canteenOrders = [];

let kitchenStatus = {
  isOpen: true,
  currentLoad: 'medium',
  avgWaitTime: 12,
  activeOrders: 5,
  staff: 4,
  announcement: 'Special: 20% off on all thalis today!'
};

let maintenanceIssues = [
  { id: '1', type: 'Electricity', title: 'Flickering lights in Lab 204', location: 'Engineering Block B', status: 'in-progress', priority: 'high', reportedBy: 'Ravi Kumar', createdAt: new Date(Date.now() - 86400000).toISOString(), lat: 28.6139, lng: 77.2090, updates: ['Electrician dispatched', 'Parts ordered'] },
  { id: '2', type: 'Plumbing', title: 'Water leakage near Canteen', location: 'Main Block Ground Floor', status: 'pending', priority: 'medium', reportedBy: 'Priya Singh', createdAt: new Date(Date.now() - 43200000).toISOString(), lat: 28.6135, lng: 77.2095, updates: [] },
  { id: '3', type: 'Cleanliness', title: 'Garbage overflow at Gate 3', location: 'Main Gate', status: 'resolved', priority: 'low', reportedBy: 'Amit Sharma', createdAt: new Date(Date.now() - 172800000).toISOString(), lat: 28.6142, lng: 77.2085, updates: ['Cleaned by housekeeping team'] },
];

let lostFoundItems = [
  { id: '1', type: 'lost', title: 'Blue Backpack', description: 'Nike blue backpack with laptop inside', location: 'Library', reportedBy: 'Sneha Patel', contact: 'sneha@campus.edu', createdAt: new Date(Date.now() - 7200000).toISOString(), status: 'active', category: 'Bags', image: null },
  { id: '2', type: 'found', title: 'Water Bottle', description: 'Steel water bottle found near gym', location: 'Gymnasium', reportedBy: 'Karan Mehta', contact: 'karan@campus.edu', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'active', category: 'Personal Items', image: null },
  { id: '3', type: 'lost', title: 'ID Card', description: 'Student ID card - Rohit Verma', location: 'Cafeteria', reportedBy: 'Rohit Verma', contact: 'rohit@campus.edu', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'claimed', category: 'Documents', image: null },
];

let events = [
  { id: '1', title: 'Tech Symposium 2026', department: 'Computer Science', type: 'workshop', date: '2026-03-05', time: '10:00 AM', venue: 'Auditorium', description: 'Annual technical symposium with industry experts', registrations: 234, maxCapacity: 300, image: null, tags: ['AI', 'ML', 'Robotics'], organizer: 'CS Department' },
  { id: '2', title: 'Cultural Fest - Utsav', department: 'Cultural Committee', type: 'fest', date: '2026-03-10', time: '5:00 PM', venue: 'Open Amphitheater', description: "University's biggest cultural extravaganza", registrations: 567, maxCapacity: 1000, image: null, tags: ['Dance', 'Music', 'Art'], organizer: 'Student Council' },
  { id: '3', title: 'Hackathon Sprint', department: 'IT Department', type: 'competition', date: '2026-03-15', time: '9:00 AM', venue: 'Innovation Lab', description: '24-hour coding challenge', registrations: 89, maxCapacity: 100, image: null, tags: ['Coding', 'Innovation'], organizer: 'IT Club' },
  { id: '4', title: 'Career Fair 2026', department: 'Placement Cell', type: 'career', date: '2026-03-20', time: '11:00 AM', venue: 'Convention Center', description: 'Meet top recruiters from 50+ companies', registrations: 445, maxCapacity: 500, image: null, tags: ['Jobs', 'Internship', 'Networking'], organizer: 'Placement Cell' },
  { id: '5', title: 'Photography Workshop', department: 'Arts', type: 'workshop', date: '2026-03-08', time: '2:00 PM', venue: 'Media Room 101', description: 'Learn professional photography techniques', registrations: 45, maxCapacity: 60, image: null, tags: ['Photography', 'Art', 'Creative'], organizer: 'Photo Club' },
];

let transportRoutes = [
  { id: '1', name: 'Route A - City Center', stops: ['Campus Gate', 'Market Square', 'Railway Station', 'Bus Terminus'], frequency: '30 mins', firstBus: '6:00 AM', lastBus: '10:00 PM', currentStatus: 'on-time', nextArrival: 8, vehicleType: 'Electric Bus', capacity: 50, currentPassengers: 32 },
  { id: '2', name: 'Route B - North Campus Loop', stops: ["Boys' Hostel", 'Girls\' Hostel', 'Sports Complex', 'Library', 'Main Gate'], frequency: '15 mins', firstBus: '7:00 AM', lastBus: '11:00 PM', currentStatus: 'delayed', nextArrival: 18, vehicleType: 'Mini Bus', capacity: 30, currentPassengers: 12 },
  { id: '3', name: 'Route C - Airport Express', stops: ['Campus Gate', 'Hotel Zone', 'International Airport'], frequency: '2 hours', firstBus: '4:00 AM', lastBus: '11:00 PM', currentStatus: 'on-time', nextArrival: 45, vehicleType: 'AC Coach', capacity: 40, currentPassengers: 15 },
];

let campusBuildings = [
  { id: '1', name: 'Main Academic Block', type: 'academic', lat: 28.6139, lng: 77.2090, description: 'Primary teaching block with 60 classrooms', floors: 5, facilities: ['Classrooms', 'Faculty Offices', 'Smart Boards'] },
  { id: '2', name: 'Library & Resource Center', type: 'library', lat: 28.6145, lng: 77.2085, description: 'State-of-the-art library with 50,000+ books', floors: 3, facilities: ['Reading Halls', 'Digital Library', 'Study Rooms'] },
  { id: '3', name: 'Engineering Block A', type: 'department', lat: 28.6132, lng: 77.2098, description: 'Home to CS, IT, and ECE departments', floors: 6, facilities: ['Labs', 'Workshops', 'Research Centers'] },
  { id: '4', name: "Boys' Hostel", type: 'hostel', lat: 28.6150, lng: 77.2075, description: 'Accommodation for 800 male students', floors: 8, facilities: ['Rooms', 'Common Room', 'Gym', 'Mess'] },
  { id: '5', name: "Girls' Hostel", type: 'hostel', lat: 28.6128, lng: 77.2110, description: 'Accommodation for 600 female students', floors: 6, facilities: ['Rooms', 'Common Room', 'Beauty Salon', 'Mess'] },
  { id: '6', name: 'Sports Complex', type: 'sports', lat: 28.6120, lng: 77.2080, description: 'Multi-sport facility', floors: 2, facilities: ['Cricket Ground', 'Football Field', 'Basketball Court', 'Swimming Pool'] },
  { id: '7', name: 'Student Activity Center', type: 'activity', lat: 28.6142, lng: 77.2102, description: 'Hub for student clubs and events', floors: 3, facilities: ['Auditorium', 'Music Room', 'Art Studio', 'Club Rooms'] },
  { id: '8', name: 'Main Canteen', type: 'food', lat: 28.6136, lng: 77.2093, description: 'Central dining facility serving 2000+ students', floors: 1, facilities: ['Food Court', 'Juice Bar', 'Mess Hall'] },
  { id: '9', name: 'Medical Center', type: 'health', lat: 28.6148, lng: 77.2100, description: '24/7 campus health facility', floors: 2, facilities: ['OPD', 'Emergency', 'Pharmacy', 'Counseling'] },
  { id: '10', name: 'Administration Block', type: 'admin', lat: 28.6141, lng: 77.2082, description: 'Central administrative offices', floors: 4, facilities: ['Registrar', 'Accounts', 'Examination Cell'] },
];

// ======================== SOCKET.IO ========================
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('kitchenStatus', kitchenStatus);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Kitchen status update interval
setInterval(() => {
  kitchenStatus.avgWaitTime = Math.max(5, Math.min(30, kitchenStatus.avgWaitTime + Math.floor(Math.random() * 5 - 2)));
  kitchenStatus.activeOrders = Math.max(0, Math.min(20, kitchenStatus.activeOrders + Math.floor(Math.random() * 3 - 1)));
  io.emit('kitchenStatus', kitchenStatus);
}, 5000);

// ======================== ROUTES ========================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Smart Campus Services Hub' });
});

// ---- CANTEEN ----
app.get('/api/canteen/menu', (req, res) => {
  const { category, available } = req.query;
  let menu = [...canteenMenu];
  if (category) menu = menu.filter(item => item.category === category);
  if (available !== undefined) menu = menu.filter(item => item.available === (available === 'true'));
  res.json({ success: true, data: menu, count: menu.length });
});

app.get('/api/canteen/kitchen-status', (req, res) => {
  res.json({ success: true, data: kitchenStatus });
});

app.get('/api/canteen/orders', (req, res) => {
  const { studentId } = req.query;
  const orders = studentId ? canteenOrders.filter(o => o.studentId === studentId) : canteenOrders;
  res.json({ success: true, data: orders.slice(-20) });
});

app.post('/api/canteen/orders', (req, res) => {
  const { items, studentName, studentId, pickupTime, paymentMethod } = req.body;
  if (!items || !items.length) return res.status(400).json({ success: false, message: 'No items in order' });

  const total = items.reduce((sum, item) => {
    const menuItem = canteenMenu.find(m => m.id === item.menuItemId);
    return sum + (menuItem ? menuItem.price * item.quantity : 0);
  }, 0);

  const maxPrepTime = items.reduce((max, item) => {
    const menuItem = canteenMenu.find(m => m.id === item.menuItemId);
    return Math.max(max, menuItem ? menuItem.prepTime : 0);
  }, 0);

  const order = {
    id: uuidv4(),
    orderNumber: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    items, studentName, studentId,
    total, pickupTime,
    paymentMethod: paymentMethod || 'campus-wallet',
    status: 'confirmed',
    estimatedReady: new Date(Date.now() + maxPrepTime * 60000).toISOString(),
    createdAt: new Date().toISOString()
  };

  canteenOrders.push(order);
  kitchenStatus.activeOrders++;
  io.emit('newOrder', order);
  io.emit('kitchenStatus', kitchenStatus);
  res.status(201).json({ success: true, data: order });
});

app.put('/api/canteen/orders/:id/status', (req, res) => {
  const order = canteenOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'ready') { kitchenStatus.activeOrders = Math.max(0, kitchenStatus.activeOrders - 1); }
  io.emit('orderUpdate', order);
  res.json({ success: true, data: order });
});

// ---- MAINTENANCE ----
app.get('/api/maintenance/issues', (req, res) => {
  const { status, type } = req.query;
  let issues = [...maintenanceIssues];
  if (status) issues = issues.filter(i => i.status === status);
  if (type) issues = issues.filter(i => i.type === type);
  res.json({ success: true, data: issues, count: issues.length });
});

app.post('/api/maintenance/issues', upload.single('photo'), (req, res) => {
  const { type, title, location, description, reportedBy, priority, lat, lng } = req.body;
  const issue = {
    id: uuidv4(), type, title, location, description, reportedBy,
    priority: priority || 'medium',
    status: 'pending',
    lat: parseFloat(lat) || null,
    lng: parseFloat(lng) || null,
    photo: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
    updates: []
  };
  maintenanceIssues.unshift(issue);
  io.emit('newIssue', issue);
  res.status(201).json({ success: true, data: issue });
});

app.put('/api/maintenance/issues/:id', (req, res) => {
  const issue = maintenanceIssues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
  Object.assign(issue, req.body);
  io.emit('issueUpdate', issue);
  res.json({ success: true, data: issue });
});

// ---- LOST & FOUND ----
app.get('/api/lostandfound/items', (req, res) => {
  const { type, status, category } = req.query;
  let items = [...lostFoundItems];
  if (type) items = items.filter(i => i.type === type);
  if (status) items = items.filter(i => i.status === status);
  if (category) items = items.filter(i => i.category === category);
  res.json({ success: true, data: items, count: items.length });
});

app.post('/api/lostandfound/items', upload.single('image'), (req, res) => {
  const { type, title, description, location, reportedBy, contact, category } = req.body;
  const item = {
    id: uuidv4(), type, title, description, location, reportedBy, contact,
    category: category || 'Other',
    status: 'active',
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };

  // Check for potential matches
  const matches = lostFoundItems.filter(existing =>
    existing.type !== type && existing.status === 'active' &&
    (existing.title.toLowerCase().includes(title.toLowerCase().split(' ')[0]) ||
     existing.category === item.category)
  );

  lostFoundItems.unshift(item);

  if (matches.length > 0) {
    io.emit('potentialMatch', { newItem: item, matches });
  }
  io.emit('newLostFoundItem', item);
  res.status(201).json({ success: true, data: item, potentialMatches: matches });
});

app.put('/api/lostandfound/items/:id', (req, res) => {
  const item = lostFoundItems.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  Object.assign(item, req.body);
  res.json({ success: true, data: item });
});

// ---- EVENTS ----
app.get('/api/events', (req, res) => {
  const { department, type } = req.query;
  let evts = [...events];
  if (department) evts = evts.filter(e => e.department === department);
  if (type) evts = evts.filter(e => e.type === type);
  res.json({ success: true, data: evts, count: evts.length });
});

app.post('/api/events', upload.single('image'), (req, res) => {
  const event = {
    id: uuidv4(),
    ...req.body,
    registrations: 0,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };
  events.unshift(event);
  io.emit('newEvent', event);
  res.status(201).json({ success: true, data: event });
});

app.post('/api/events/:id/register', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  if (event.registrations >= event.maxCapacity) return res.status(400).json({ success: false, message: 'Event is full' });
  event.registrations++;
  io.emit('eventUpdate', event);
  res.json({ success: true, data: event, message: 'Registration successful!' });
});

// ---- TRANSPORT ----
app.get('/api/transport/routes', (req, res) => {
  res.json({ success: true, data: transportRoutes });
});

app.get('/api/transport/routes/:id', (req, res) => {
  const route = transportRoutes.find(r => r.id === req.params.id);
  if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
  res.json({ success: true, data: route });
});

// ---- MAP ----
app.get('/api/map/buildings', (req, res) => {
  const { type } = req.query;
  let buildings = [...campusBuildings];
  if (type) buildings = buildings.filter(b => b.type === type);
  res.json({ success: true, data: buildings });
});

// ======================== START SERVER ========================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Smart Campus Services Hub Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled for real-time updates`);
  console.log(`🌐 API available at http://localhost:${PORT}/api\n`);
});
