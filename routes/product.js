const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');

// Storage settings (Same as before)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), 
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1. ADD PRODUCT ROUTE
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image upload karein!" });

    const newProduct = new Product({
      name,
      price: Number(price), 
      category: categoryId, 
      image: req.file.filename
    });
    await newProduct.save();
    res.json({ message: "Product Added Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 2. GET ALL PRODUCTS ROUTE
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Data fetch nahi ho raha", error: err.message });
  }
});

// --- NAYE ROUTES JO MISSING THAY ---

// DELETE Route
// Iska rasta ab backend pe "/api/products/:id" ban jayega
router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Item nahi mila" });
    res.json({ message: "Bangle deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE Route

// 1. Single product ka data lene ke liye (Edit page load karne ke liye)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Product not found", error: err.message });
  }
});

// 2. Product UPDATE karne ke liye (Multer support ke sath)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    let updateData = { 
      name, 
      price: Number(price), 
      category: categoryId 
    };

    // Agar nayi image aayi hai toh path update karo
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.json({ message: "Product Updated!", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Update fail!", error: err.message });
  }
});

// module.exports = router; (Ye line pehle se hogi, iske upar rakhein)

module.exports = router;