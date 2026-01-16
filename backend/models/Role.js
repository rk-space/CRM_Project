const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    is_system_role: {
        type: Boolean,
        default: false
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null 
    },
    is_deleted: {
    type: Boolean,
    default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
