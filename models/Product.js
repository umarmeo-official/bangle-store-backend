const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    image: { type: String }, // Product ki photo ke liye
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);