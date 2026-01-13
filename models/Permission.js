const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    module: {
        type: String,
        required: true,
        enum: ['crm', 'sales', 'finance', 'hr', 'inventory', 'auth']
    },
    resource: {
        type: String,
        required: true,
        enum: ['leads', 'invoices', 'payments', 'users']
    },
    action: {
        type: String,
        required: true,
        enum: ['view', 'create', 'edit', 'delete', 'approve', 'export']
    },
    scope: {
        type: String,
        required: true,
        enum: ['own', 'team', 'branch', 'company', 'all'],
        default: 'own'
    }
}, { timestamps: true });

// Compound index to ensure uniqueness of permissions
PermissionSchema.index({ module: 1, resource: 1, action: 1, scope: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);
