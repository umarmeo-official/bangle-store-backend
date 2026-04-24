// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Add Category
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await Category.findOne({ name });
        if (exists) return res.status(400).json({ message: "Category already exists!" });

        const newCat = new Category({ name });
        await newCat.save();
        res.json({ message: "Category added successfully!" });
    } catch (err) { res.status(500).json(err); }
});

// Get All Categories
router.get('/all', async (req, res) => {
    const cats = await Category.find().sort({ createdAt: -1 });
    res.json(cats);
});

// Delete Category
router.delete('/:id', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted!" });
});

// routes/category.js ke andar

// Update Category (Ye missing tha)
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check karein ke naya naam khali na ho
        if (!name) return res.status(400).json({ message: "Name is required!" });

        const updatedCat = await Category.findByIdAndUpdate(
            req.params.id, 
            { name }, 
            { new: true } // Taaki update ke baad naya data response mein miley
        );

        if (!updatedCat) return res.status(404).json({ message: "Category not found!" });

        res.json({ message: "Category Update Ho Gayi!", updatedCat });
    } catch (err) { 
        res.status(500).json({ message: "Server Error", error: err.message }); 
    }
});

// module.exports se pehle add karna hai


module.exports = router;