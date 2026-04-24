const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db'); 
const path = require('path');
const app = express();

// 1. Database Connect karein (Purana data same hai)
connectDB();

// 2. Middlewares (Aapka purana setup)
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. Static Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routes - Yahan maine rasta sahi kar diya hai
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/category')); // Ab ye error nahi dega
app.use('/api/products', require('./routes/product'));   // Product ka rasta bhi set hai

app.get('/', (req, res) => {
    res.send('Server aur Database dono fit hain!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server shuru ho gaya port ${PORT} par!`);
});