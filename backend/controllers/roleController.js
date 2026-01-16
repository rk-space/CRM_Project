const Role = require('../models/Role');
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin)
exports.createRole = async (req, res) => {
    try {
        const { role_name, description, permissions } = req.body;

        const roleExists = await Role.findOne({ role_name });
        if (roleExists) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        const role = await Role.create({
            role_name,
            description,
            permissions,
            created_by: req.user._id
        });

        // Log action
        await AuditLog.create({
            user_id: req.user._id,
            action: 'create_role',
            resource: 'roles',
            details: { role_name: role.role_name },
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin/Manager)
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ is_deleted: false })
            .populate('permissions')
            .populate('created_by', 'first_name last_name email');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id)
            .populate('permissions')
            .populate('created_by', 'first_name last_name email');

        if (!role || role.is_deleted) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (Admin)
exports.updateRole = async (req, res) => {
    try {
        const { role_name, description, permissions } = req.body;
        const role = await Role.findById(req.params.id);

        if (!role || role.is_deleted) {
            return res.status(404).json({ message: 'Role not found' });
        }

        if (role.is_system_role) {
            return res.status(403).json({ message: 'System roles cannot be modified' });
        }

        role.role_name = role_name || role.role_name;
        role.description = description || role.description;
        role.permissions = permissions || role.permissions;

        const updatedRole = await role.save();

        // Log action
        await AuditLog.create({
            user_id: req.user._id,
            action: 'update_role',
            resource: 'roles',
            details: { role_id: role._id, updates: req.body },
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete role (Soft delete)
// @route   DELETE /api/roles/:id
// @access  Private (Admin)
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role || role.is_deleted) {
            return res.status(404).json({ message: 'Role not found' });
        }

        if (role.is_system_role) {
            return res.status(403).json({ message: 'System roles cannot be deleted' });
        }

        role.is_deleted = true;
        await role.save();

        // Log action
        await AuditLog.create({
            user_id: req.user._id,
            action: 'delete_role',
            resource: 'roles',
            details: { role_id: role._id },
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        res.json({ message: 'Role removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};