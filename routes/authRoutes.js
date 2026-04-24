const express = require('express');
const router = express.Router();
const multer = require('multer');
// Controller se functions sahi tarah import karein
const { registerUser, loginUser } = require('../controllers/authController');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser); // Login ke liye 'upload' ki zaroorat nahi hai

module.exports = router;