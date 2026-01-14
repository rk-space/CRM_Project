const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Scope Hierarchy: all > company > branch > team > own
const SCOPE_HIERARCHY = {
    'all': 5,
    'company': 4,
    'branch': 3,
    'team': 2,
    'own': 1
};

/**
 * Middleware to check if user has permission for a specific resource and action.
 * Calculates the 'Highest' scope allowed for that action based on user roles.
 */
const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            }

            // Fetch user with full permission details
            const userWithPermissions = await User.findById(req.user._id).populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

            if (!userWithPermissions) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }

            // Extract all permissions from roles
            const effectivePermissions = [];
            userWithPermissions.roles.forEach(role => {
                if (role.permissions) {
                    effectivePermissions.push(...role.permissions);
                }
            });

            // Find permissions matching resource and action
            const matchingPermissions = effectivePermissions.filter(p =>
                p.resource === resource && p.action === action
            );

            if (matchingPermissions.length === 0) {
                return res.status(403).json({
                    message: `Forbidden: No permission for ${action} on ${resource}`
                });
            }

            // Resolve the highest scope
            let highestScope = 'own';
            let maxVal = 0;

            matchingPermissions.forEach(p => {
                const val = SCOPE_HIERARCHY[p.scope] || 0;
                if (val > maxVal) {
                    maxVal = val;
                    highestScope = p.scope;
                }
            });

            // Attach effective scope to request for controller layer logic
            req.permissionScope = highestScope;

            next();
        } catch (error) {
            console.error('RBAC Middleware Error:', error);
            res.status(500).json({ message: 'Internal Server Error during authorization' });
        }
    };
};

module.exports = { checkPermission };
