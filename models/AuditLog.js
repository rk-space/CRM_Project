const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Flexible field for details (before/after state)
        default: {}
    },
    ip_address: {
        type: String
    },
    user_agent: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
