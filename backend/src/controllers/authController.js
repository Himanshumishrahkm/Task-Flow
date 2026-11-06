const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const safeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
});

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "An account with this email already exists."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "Registration successful.",
        token,
        user: safeUser(user)
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: safeUser(user)
    });
};

const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: safeUser(req.user)
    });
};

module.exports = { register, login, getMe };
