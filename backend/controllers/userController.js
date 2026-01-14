const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

/**
 * Utility function for internal audit logging
 */
const logAudit = async (req, userId, action, resource, details) => {
    try {
        await AuditLog.create({
            user_id: userId,
            action,
            resource,
            details,
            ip_address: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            user_agent: req.headers['user-agent']
        });
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
};

/**
 * @desc Get all users with scope-based filtering
 */
exports.getUsers = async (req, res) => {
    try {
        const scope = req.permissionScope;
        let query = {};

        if (scope === 'own') {
            query._id = req.user._id;
        } else if (scope === 'branch') {
            if (req.user.branch_id) {
                query.branch_id = req.user.branch_id;
            } else {
                // Return only own if user has no branch_id but has branch scope
                query._id = req.user._id;
            }
        }
        // scope 'all' means empty query {}

        const users = await User.find(query)
            .select('-password_hash')
            .populate('roles', 'role_name');

        res.status(200).json({
            success: true,
            count: users.length,
            scope,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Create a new user
 */
exports.createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, role_ids, branch_id, department_id } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            phone,
            password_hash: password, // Hashed by pre-save modle hook
            roles: role_ids || [],
            branch_id: branch_id || null,
            department_id: department_id || null,
            status: 'active'
        });

        await logAudit(req, req.user._id, 'CREATE', 'users', { created_user_id: newUser._id, email });

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Get single user by ID with scope validation
 */
exports.getUserById = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id)
            .select('-password_hash')
            .populate('roles');

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const scope = req.permissionScope;
        let isAuthorized = false;

        if (scope === 'all') isAuthorized = true;
        else if (scope === 'own' && targetUser._id.equals(req.user._id)) isAuthorized = true;
        else if (scope === 'branch' && targetUser.branch_id && req.user.branch_id && targetUser.branch_id.equals(req.user.branch_id)) isAuthorized = true;

        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: 'Forbidden: Access denied by scope' });
        }

        res.status(200).json({ success: true, data: targetUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Update user
 */
exports.updateUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const scope = req.permissionScope;
        let isAuthorized = false;
        if (scope === 'all') isAuthorized = true;
        else if (scope === 'own' && targetUser._id.equals(req.user._id)) isAuthorized = true;
        else if (scope === 'branch' && targetUser.branch_id && req.user.branch_id && targetUser.branch_id.equals(req.user.branch_id)) isAuthorized = true;

        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const updates = req.body;
        // Don't allow password update via this endpoint for now
        delete updates.password_hash;

        // Only Admins (scope all) can change roles or status
        if (scope !== 'all') {
            delete updates.roles;
            delete updates.status;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password_hash');

        await logAudit(req, req.user._id, 'UPDATE', 'users', { updated_user_id: targetUser._id });

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Soft delete / deactivate user
 */
exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const scope = req.permissionScope;
        // Typically only admin (all) can delete/deactivate users
        if (scope !== 'all') {
            return res.status(403).json({ success: false, message: 'Forbidden: Admin access required for deletion' });
        }

        targetUser.status = 'inactive';
        await targetUser.save();

        await logAudit(req, req.user._id, 'DELETE_SOFT', 'users', { deleted_user_id: targetUser._id });

        res.status(200).json({ success: true, message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
