const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- REGISTER (Image ke saath) ---
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imagePath = req.file ? req.file.path : ""; 

        // 1. Email Check
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        // 2. Password Hash (PHP ka password_hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save to MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            image: imagePath ? req.file.path : ""  // Image ka rasta database mein save ho raha hai
        });

        res.status(201).json({ message: "Data register successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- LOGIN ---
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not registered" });

        // Password Match (PHP ka password_verify)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        res.status(200).json({ 
            message: "Login successfully",
            user: { name: user.name, email: user.email, image: user.image, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};