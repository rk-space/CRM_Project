const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');

// Generate Access Token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

// @desc    Register a new user (For testing purposes mostly, or initial setup)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Get default role 'User' or verify if specific role requested (simplification for Day 1)
        // For now, we will assign a default role if not provided in seed.
        // In a real app, registration might not be public or roles are restricted.

        const user = await User.create({
            first_name,
            last_name,
            email,
            phone,
            password_hash: password, // Pre-save hook will hash this
        });

        if (user) {
            // Log action
            await AuditLog.create({
                user_id: user._id,
                action: 'user_register',
                resource: 'users',
                details: { email: user.email },
                ip_address: req.ip,
                user_agent: req.headers['user-agent']
            });

            res.status(201).json({
                _id: user._id,
                first_name: user.first_name,
                email: user.email,
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate('roles');

        if (user && (await user.matchPassword(password))) {
            if (user.status !== 'active') {
                return res.status(401).json({ message: 'Account is not active' });
            }

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Send Refresh Token in HttpOnly cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Update Last Login
            user.last_login_at = Date.now();
            await user.save();

            // Log action
            await AuditLog.create({
                user_id: user._id,
                action: 'login',
                resource: 'auth',
                ip_address: req.ip,
                user_agent: req.headers['user-agent']
            });

            res.json({
                _id: user._id,
                first_name: user.first_name,
                email: user.email,
                roles: user.roles,
                accessToken,
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (or Public if just clearing cookie)
exports.logout = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    // Ideally we should log this action too, but we need the user ID from the request if authenticated.
    // If we call this from an authenticated context, we can log it.

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Cookie based)
exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized - No Refresh Token' });

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if user still exists and is active
        const user = await User.findById(decoded.id);
        if (!user || user.status !== 'active') return res.status(401).json({ message: 'Unauthorized' });

        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken });

    } catch (error) {
        res.status(403).json({ message: 'Forbidden - Invalid Refresh Token' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password_hash').populate('roles');
    res.json(user);
};
