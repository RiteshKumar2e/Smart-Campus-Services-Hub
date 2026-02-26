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
const { handleChat } = require('./chatbot');

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
  // Fun Food - Traditional & South Indian (20 items)
  { id: 'ff1', name: 'Masala Dosa', category: 'South Indian', canteen: 'Fun Food', price: 50, prepTime: 12, available: true, rating: 4.5, calories: 320, image: 'dosa' },
  { id: 'ff2', name: 'Onion Uttapam', category: 'South Indian', canteen: 'Fun Food', price: 55, prepTime: 15, available: true, rating: 4.4, calories: 350, image: 'dosa' },
  { id: 'ff3', name: 'Idli (2pcs) with Sambar', category: 'South Indian', canteen: 'Fun Food', price: 35, prepTime: 5, available: true, rating: 4.6, calories: 210, image: 'dosa' },
  { id: 'ff4', name: 'Medu Vada (2pcs)', category: 'South Indian', canteen: 'Fun Food', price: 40, prepTime: 10, available: true, rating: 4.5, calories: 280, image: 'dosa' },
  { id: 'ff5', name: 'Mysore Bonda (4pcs)', category: 'South Indian', canteen: 'Fun Food', price: 30, prepTime: 8, available: true, rating: 4.3, calories: 240, image: 'dosa' },
  { id: 'ff6', name: 'Puri Sabji (3pcs)', category: 'Main Course', canteen: 'Fun Food', price: 45, prepTime: 12, available: true, rating: 4.7, calories: 420, image: 'paratha' },
  { id: 'ff7', name: 'Special Veg Thali', category: 'Thali', canteen: 'Fun Food', price: 80, prepTime: 15, available: true, rating: 4.8, calories: 850, image: 'thali' },
  { id: 'ff8', name: 'Veg Grilled Sandwich', category: 'Fast Food', canteen: 'Fun Food', price: 50, prepTime: 8, available: true, rating: 4.2, calories: 280, image: 'burger' },
  { id: 'ff9', name: 'Classic Veg Burger', category: 'Fast Food', canteen: 'Fun Food', price: 60, prepTime: 10, available: true, rating: 4.3, calories: 450, image: 'burger' },
  { id: 'ff10', name: 'Paneer Butter Masala', category: 'Main Course', canteen: 'Fun Food', price: 110, prepTime: 20, available: true, rating: 4.8, calories: 550, image: 'paneer' },
  { id: 'ff11', name: 'Rava Masala Dosa', category: 'South Indian', canteen: 'Fun Food', price: 65, prepTime: 15, available: true, rating: 4.6, calories: 380, image: 'dosa' },
  { id: 'ff12', name: 'Paper Masala Dosa', category: 'South Indian', canteen: 'Fun Food', price: 70, prepTime: 15, available: true, rating: 4.7, calories: 360, image: 'dosa' },
  { id: 'ff13', name: 'Set Dosa (3pcs)', category: 'South Indian', canteen: 'Fun Food', price: 50, prepTime: 12, available: true, rating: 4.4, calories: 340, image: 'dosa' },
  { id: 'ff14', name: 'Curd Vada (2pcs)', category: 'South Indian', canteen: 'Fun Food', price: 45, prepTime: 5, available: true, rating: 4.6, calories: 220, image: 'dosa' },
  { id: 'ff15', name: 'Lemon Rice', category: 'Main Course', canteen: 'Fun Food', price: 50, prepTime: 10, available: true, rating: 4.5, calories: 380, image: 'rice' },
  { id: 'ff16', name: 'Tamarind Rice', category: 'Main Course', canteen: 'Fun Food', price: 50, prepTime: 10, available: true, rating: 4.4, calories: 410, image: 'rice' },
  { id: 'ff17', name: 'Pongal Special', category: 'South Indian', canteen: 'Fun Food', price: 40, prepTime: 8, available: true, rating: 4.7, calories: 320, image: 'dosa' },
  { id: 'ff18', name: 'Rava Upma', category: 'South Indian', canteen: 'Fun Food', price: 30, prepTime: 8, available: true, rating: 4.3, calories: 240, image: 'dosa' },
  { id: 'ff19', name: 'Veg Hyderabadi Biryani', category: 'Main Course', canteen: 'Fun Food', price: 100, prepTime: 20, available: true, rating: 4.8, calories: 580, image: 'rice' },
  { id: 'ff20', name: 'Malai Kofta Special', category: 'Main Course', canteen: 'Fun Food', price: 120, prepTime: 20, available: true, rating: 4.9, calories: 620, image: 'paneer' },

  // Nescafe - Cafe Vibes (20 items)
  { id: 'ns1', name: 'Cappuccino', category: 'Beverages', canteen: 'Nescafe', price: 45, prepTime: 5, available: true, rating: 4.7, calories: 120, image: 'coffee' },
  { id: 'ns2', name: 'Classic Cold Coffee', category: 'Beverages', canteen: 'Nescafe', price: 55, prepTime: 5, available: true, rating: 4.9, calories: 280, image: 'coffee' },
  { id: 'ns3', name: 'Lemon Ice Tea', category: 'Beverages', canteen: 'Nescafe', price: 40, prepTime: 3, available: true, rating: 4.6, calories: 90, image: 'juice' },
  { id: 'ns4', name: 'White Sauce Pasta', category: 'Fast Food', canteen: 'Nescafe', price: 90, prepTime: 15, available: true, rating: 4.8, calories: 520, image: 'noodles' },
  { id: 'ns5', name: 'Peri Peri Fries', category: 'Snacks', canteen: 'Nescafe', price: 60, prepTime: 10, available: true, rating: 4.7, calories: 340, image: 'burger' },
  { id: 'ns6', name: 'Classic Salted Fries', category: 'Snacks', canteen: 'Nescafe', price: 50, prepTime: 8, available: true, rating: 4.5, calories: 310, image: 'burger' },
  { id: 'ns7', name: 'Hazelnut Frappe', category: 'Beverages', canteen: 'Nescafe', price: 75, prepTime: 7, available: true, rating: 4.9, calories: 350, image: 'coffee' },
  { id: 'ns8', name: 'Garlic Bread (3pcs)', category: 'Snacks', canteen: 'Nescafe', price: 45, prepTime: 8, available: true, rating: 4.4, calories: 240, image: 'burger' },
  { id: 'ns9', name: 'Iced Americano', category: 'Beverages', canteen: 'Nescafe', price: 40, prepTime: 3, available: true, rating: 4.5, calories: 15, image: 'coffee' },
  { id: 'ns10', name: 'Caramel Macchiato', category: 'Beverages', canteen: 'Nescafe', price: 80, prepTime: 7, available: true, rating: 4.8, calories: 310, image: 'coffee' },
  { id: 'ns11', name: 'Hot Chocolate', category: 'Beverages', canteen: 'Nescafe', price: 65, prepTime: 6, available: true, rating: 4.9, calories: 220, image: 'coffee' },
  { id: 'ns12', name: 'Peach Iced Tea', category: 'Beverages', canteen: 'Nescafe', price: 45, prepTime: 3, available: true, rating: 4.6, calories: 95, image: 'juice' },
  { id: 'ns13', name: 'Red Sauce Pasta', category: 'Fast Food', canteen: 'Nescafe', price: 85, prepTime: 15, available: true, rating: 4.7, calories: 480, image: 'noodles' },
  { id: 'ns14', name: 'Mixed Sauce Pasta', category: 'Fast Food', canteen: 'Nescafe', price: 100, prepTime: 15, available: true, rating: 4.9, calories: 550, image: 'noodles' },
  { id: 'ns15', name: 'Sweet Corn Sandwich', category: 'Fast Food', canteen: 'Nescafe', price: 50, prepTime: 8, available: true, rating: 4.4, calories: 270, image: 'burger' },
  { id: 'ns16', name: 'Paneer Tikka Sandwich', category: 'Fast Food', canteen: 'Nescafe', price: 70, prepTime: 10, available: true, rating: 4.7, calories: 340, image: 'burger' },
  { id: 'ns17', name: 'Veg Nuggets (6pcs)', category: 'Snacks', canteen: 'Nescafe', price: 55, prepTime: 8, available: true, rating: 4.3, calories: 280, image: 'burger' },
  { id: 'ns18', name: 'Potato Wedges', category: 'Snacks', canteen: 'Nescafe', price: 65, prepTime: 10, available: true, rating: 4.5, calories: 320, image: 'burger' },
  { id: 'ns19', name: 'Brownie with Ice Cream', category: 'Desserts', canteen: 'Nescafe', price: 80, prepTime: 5, available: true, rating: 4.9, calories: 450, image: 'thali' },
  { id: 'ns20', name: 'Choco Chip Muffin', category: 'Desserts', canteen: 'Nescafe', price: 40, prepTime: 2, available: true, rating: 4.6, calories: 210, image: 'burger' },

  // All is Well - Mega Menu (50 items)
  { id: 'aw1', name: 'Masala Chai', category: 'Beverages', canteen: 'All is Well', price: 10, prepTime: 5, available: true, rating: 4.9, calories: 60, image: 'tea' },
  { id: 'aw2', name: 'Ginger Tea', category: 'Beverages', canteen: 'All is Well', price: 12, prepTime: 5, available: true, rating: 4.8, calories: 60, image: 'tea' },
  { id: 'aw3', name: 'Bun Maska', category: 'Snacks', canteen: 'All is Well', price: 25, prepTime: 3, available: true, rating: 4.7, calories: 280, image: 'burger' },
  { id: 'aw4', name: 'Vada Pav', category: 'Snacks', canteen: 'All is Well', price: 15, prepTime: 3, available: true, rating: 4.8, calories: 240, image: 'vadapav' },
  { id: 'aw5', name: 'Samosa (1pc)', category: 'Snacks', canteen: 'All is Well', price: 12, prepTime: 2, available: true, rating: 4.6, calories: 150, image: 'samosa' },
  { id: 'aw6', name: 'Bread Pakora', category: 'Snacks', canteen: 'All is Well', price: 15, prepTime: 5, available: true, rating: 4.5, calories: 210, image: 'samosa' },
  { id: 'aw7', name: 'Veg Maggi', category: 'Fast Food', canteen: 'All is Well', price: 30, prepTime: 8, available: true, rating: 4.9, calories: 280, image: 'maggi' },
  { id: 'aw8', name: 'Cheese Maggi', category: 'Fast Food', canteen: 'All is Well', price: 45, prepTime: 10, available: true, rating: 4.8, calories: 380, image: 'maggi' },
  { id: 'aw9', name: 'Paneer Maggi', category: 'Fast Food', canteen: 'All is Well', price: 50, prepTime: 10, available: true, rating: 4.7, calories: 410, image: 'maggi' },
  { id: 'aw10', name: 'Aloo Paratha', category: 'Main Course', canteen: 'All is Well', price: 35, prepTime: 12, available: true, rating: 4.6, calories: 350, image: 'paratha' },
  { id: 'aw11', name: 'Paneer Paratha', category: 'Main Course', canteen: 'All is Well', price: 50, prepTime: 15, available: true, rating: 4.7, calories: 420, image: 'paratha' },
  { id: 'aw12', name: 'Veg Grilled Sandwich', category: 'Fast Food', canteen: 'All is Well', price: 40, prepTime: 8, available: true, rating: 4.5, calories: 260, image: 'burger' },
  { id: 'aw13', name: 'Cheese Grilled Sandwich', category: 'Fast Food', canteen: 'All is Well', price: 55, prepTime: 8, available: true, rating: 4.6, calories: 340, image: 'burger' },
  { id: 'aw14', name: 'Veg Hakka Noodles', category: 'Fast Food', canteen: 'All is Well', price: 60, prepTime: 12, available: true, rating: 4.4, calories: 420, image: 'noodles' },
  { id: 'aw15', name: 'Schezwan Noodles', category: 'Fast Food', canteen: 'All is Well', price: 70, prepTime: 12, available: true, rating: 4.5, calories: 450, image: 'noodles' },
  { id: 'aw16', name: 'Veg Fried Rice', category: 'Main Course', canteen: 'All is Well', price: 60, prepTime: 12, available: true, rating: 4.4, calories: 480, image: 'rice' },
  { id: 'aw17', name: 'Paneer Fried Rice', category: 'Main Course', canteen: 'All is Well', price: 80, prepTime: 15, available: true, rating: 4.6, calories: 550, image: 'rice' },
  { id: 'aw18', name: 'Veg Manchurian (Dry)', category: 'Fast Food', canteen: 'All is Well', price: 70, prepTime: 15, available: true, rating: 4.5, calories: 320, image: 'noodles' },
  { id: 'aw19', name: 'Veg Manchurian (Gravy)', category: 'Fast Food', canteen: 'All is Well', price: 80, prepTime: 18, available: true, rating: 4.6, calories: 380, image: 'noodles' },
  { id: 'aw20', name: 'Paneer Chilli (Dry)', category: 'Fast Food', canteen: 'All is Well', price: 100, prepTime: 15, available: true, rating: 4.7, calories: 410, image: 'paneer' },
  { id: 'aw21', name: 'Veg Momo (6pcs)', category: 'Snacks', canteen: 'All is Well', price: 40, prepTime: 10, available: true, rating: 4.4, calories: 180, image: 'samosa' },
  { id: 'aw22', name: 'Fried Momo (6pcs)', category: 'Snacks', canteen: 'All is Well', price: 50, prepTime: 12, available: true, rating: 4.5, calories: 240, image: 'samosa' },
  { id: 'aw23', name: 'Paneer Momo (6pcs)', category: 'Snacks', canteen: 'All is Well', price: 60, prepTime: 12, available: true, rating: 4.6, calories: 260, image: 'samosa' },
  { id: 'aw24', name: 'Pav Bhaji', category: 'Main Course', canteen: 'All is Well', price: 60, prepTime: 15, available: true, rating: 4.7, calories: 520, image: 'paratha' },
  { id: 'aw25', name: 'Extra Pav (1pc)', category: 'Main Course', canteen: 'All is Well', price: 10, prepTime: 2, available: true, rating: 4.4, calories: 120, image: 'burger' },
  { id: 'aw26', name: 'Chole Bhature', category: 'Main Course', canteen: 'All is Well', price: 70, prepTime: 18, available: true, rating: 4.7, calories: 720, image: 'chole' },
  { id: 'aw27', name: 'Mixed Veg Paratha', category: 'Main Course', canteen: 'All is Well', price: 45, prepTime: 15, available: true, rating: 4.5, calories: 360, image: 'paratha' },
  { id: 'aw28', name: 'Gobi Paratha', category: 'Main Course', canteen: 'All is Well', price: 40, prepTime: 15, available: true, rating: 4.4, calories: 320, image: 'paratha' },
  { id: 'aw29', name: 'Bread Omelette (Veg/Cheese)', category: 'Snacks', canteen: 'All is Well', price: 40, prepTime: 8, available: true, rating: 4.3, calories: 220, image: 'burger' },
  { id: 'aw30', name: 'Veg Roll', category: 'Fast Food', canteen: 'All is Well', price: 45, prepTime: 10, available: true, rating: 4.5, calories: 340, image: 'burger' },
  { id: 'aw31', name: 'Paneer Roll', category: 'Fast Food', canteen: 'All is Well', price: 60, prepTime: 12, available: true, rating: 4.6, calories: 420, image: 'paneer' },
  { id: 'aw32', name: 'Samosa Pav', category: 'Snacks', canteen: 'All is Well', price: 20, prepTime: 3, available: true, rating: 4.5, calories: 310, image: 'vadapav' },
  { id: 'aw33', name: 'Vada Pav with Cheese', category: 'Snacks', canteen: 'All is Well', price: 25, prepTime: 3, available: true, rating: 4.7, calories: 320, image: 'vadapav' },
  { id: 'aw34', name: 'Dahi Vada (2pcs)', category: 'South Indian', canteen: 'All is Well', price: 40, prepTime: 5, available: true, rating: 4.6, calories: 180, image: 'dosa' },
  { id: 'aw35', name: 'Poori Bhaji', category: 'Main Course', canteen: 'All is Well', price: 45, prepTime: 12, available: true, rating: 4.5, calories: 410, image: 'paratha' },
  { id: 'aw36', name: 'Veg Pulao', category: 'Main Course', canteen: 'All is Well', price: 60, prepTime: 15, available: true, rating: 4.4, calories: 450, image: 'rice' },
  { id: 'aw37', name: 'Jeera Rice', category: 'Main Course', canteen: 'All is Well', price: 50, prepTime: 10, available: true, rating: 4.3, calories: 380, image: 'rice' },
  { id: 'aw38', name: 'Dal Fry', category: 'Main Course', canteen: 'All is Well', price: 60, prepTime: 15, available: true, rating: 4.4, calories: 320, image: 'paneer' },
  { id: 'aw39', name: 'Tandoori Roti', category: 'Main Course', canteen: 'All is Well', price: 10, prepTime: 8, available: true, rating: 4.5, calories: 120, image: 'naan' },
  { id: 'aw40', name: 'Butter Roti', category: 'Main Course', canteen: 'All is Well', price: 15, prepTime: 8, available: true, rating: 4.6, calories: 160, image: 'naan' },
  { id: 'aw41', name: 'Curd Rice', category: 'South Indian', canteen: 'All is Well', price: 50, prepTime: 8, available: true, rating: 4.7, calories: 310, image: 'rice' },
  { id: 'aw42', name: 'Veg Sandwich (Cold)', category: 'Fast Food', canteen: 'All is Well', price: 30, prepTime: 5, available: true, rating: 4.3, calories: 210, image: 'burger' },
  { id: 'aw43', name: 'Hot Milk with Bournvita', category: 'Beverages', canteen: 'All is Well', price: 20, prepTime: 5, available: true, rating: 4.6, calories: 180, image: 'tea' },
  { id: 'aw44', name: 'Fresh Lime Soda', category: 'Beverages', canteen: 'All is Well', price: 25, prepTime: 5, available: true, rating: 4.5, calories: 80, image: 'juice' },
  { id: 'aw45', name: 'Mango Lassi', category: 'Beverages', canteen: 'All is Well', price: 40, prepTime: 5, available: true, rating: 4.8, calories: 280, image: 'juice' },
  { id: 'aw46', name: 'Butter Milk', category: 'Beverages', canteen: 'All is Well', price: 15, prepTime: 2, available: true, rating: 4.7, calories: 60, image: 'juice' },
  { id: 'aw47', name: 'Bread Butter Toast', category: 'Snacks', canteen: 'All is Well', price: 20, prepTime: 5, available: true, rating: 4.4, calories: 180, image: 'burger' },
  { id: 'aw48', name: 'Bread Jam', category: 'Snacks', canteen: 'All is Well', price: 15, prepTime: 3, available: true, rating: 4.3, calories: 160, image: 'burger' },
  { id: 'aw49', name: 'Upma', category: 'South Indian', canteen: 'All is Well', price: 25, prepTime: 8, available: true, rating: 4.5, calories: 210, image: 'dosa' },
  { id: 'aw50', name: 'Sabudana Khichdi', category: 'Snacks', canteen: 'All is Well', price: 40, prepTime: 10, available: true, rating: 4.8, calories: 320, image: 'vadapav' },
];

let canteenOrders = [];

let kitchenStatus = {
  isOpen: true,
  currentLoad: 'medium',
  avgWaitTime: 12,
  activeOrders: 5,
  staff: 15,
  announcement: ''
};

let maintenanceIssues = [];

let lostFoundItems = [];

let events = [];

let transportRoutes = [
  { id: '1', name: 'Route A - City Center', stops: ['Campus Gate', 'Market Square', 'Railway Station', 'Bus Terminus'], frequency: '30 mins', firstBus: '6:00 AM', lastBus: '10:00 PM', currentStatus: 'on-time', nextArrival: 8, vehicleType: 'Electric Bus', capacity: 50, currentPassengers: 32 },
  { id: '2', name: 'Route B - North Campus Loop', stops: ["Boys' Hostel", 'Girls\' Hostel', 'Sports Complex', 'Library', 'Main Gate'], frequency: '15 mins', firstBus: '7:00 AM', lastBus: '11:00 PM', currentStatus: 'delayed', nextArrival: 18, vehicleType: 'Mini Bus', capacity: 30, currentPassengers: 12 },
  { id: '3', name: 'Route C - Airport Express', stops: ['Campus Gate', 'Hotel Zone', 'International Airport'], frequency: '2 hours', firstBus: '4:00 AM', lastBus: '11:00 PM', currentStatus: 'on-time', nextArrival: 45, vehicleType: 'AC Coach', capacity: 40, currentPassengers: 15 },
];

let campusBuildings = [
  { id: '1', name: 'Academic Block A (Biotechnology)', type: 'academic', lat: 22.8434, lng: 86.1024, description: 'Center for Pharmaceutical and Life Sciences', floors: 4, facilities: ['Bio-Tech Labs', 'Research Cell'], image: '/artifacts/aju_campus_main_gate_1772104555214.png' },
  { id: '2', name: 'Academic Block B (Pharmacy)', type: 'academic', lat: 22.8430, lng: 86.1028, description: 'Dedicated wing for B.Pharma and M.Pharma students', floors: 4, facilities: ['Chemistry Lab', 'Drug Research'] },
  { id: '3', name: 'Academic Block C (Engineering & Library)', type: 'academic', lat: 22.8426, lng: 86.1032, description: 'Home to Engineering departments and the University Central Library', floors: 5, facilities: ['Computer Labs', 'Central Library', 'Electronics Lab'] },
  { id: '4', name: 'Academic Block D (Workshop Area)', type: 'academic', lat: 22.8422, lng: 86.1036, description: 'Practical training area and central engineering workshops', floors: 1, facilities: ['Mechanical Shop', 'Project Lab'] },
  { id: '5', name: 'Academic Block E (Diploma & BCA)', type: 'academic', lat: 22.8418, lng: 86.1040, description: 'Academic center for Diploma and BCA students', floors: 4, facilities: ['Programming Hub', 'Language Lab'] },
  { id: '6', name: 'Academic Block F (Management)', type: 'academic', lat: 22.8414, lng: 86.1044, description: 'Center for Commerce and Management studies', floors: 4, facilities: ['Seminar Hall', 'Placement Office'] },
  { id: '7', name: 'Nescafe', type: 'food', lat: 22.8436, lng: 86.1020, description: 'University coffee point and hangout zone', floors: 1, facilities: ['Coffee Bar', 'Snacks'] },
  { id: '8', name: 'All Is Well', type: 'food', lat: 22.8440, lng: 86.1016, description: 'Main vegetarian canteen serving meals and refreshments', floors: 1, facilities: ['Main Dining', 'Buffet'] },
  { id: '9', name: 'Arka Jain University Office', type: 'admin', lat: 22.7938, lng: 86.1852, description: 'City Admission & Administrative Office (Dhatkidih)', floors: 3, facilities: ['Admission Cell', 'Administrative Desk'] },
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

// ---- CHATBOT ----
app.post('/api/chat', handleChat);

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
