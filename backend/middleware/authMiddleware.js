const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password_hash').populate('roles');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            if (req.user.status !== 'active') {
                return res.status(401).json({ message: 'Not authorized, user is inactive' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Check for specific roles (Basic RBAC)
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles.map(role => role.role_name);
        const hasRole = userRoles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
