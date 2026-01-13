const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password_hash: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive', 'locked'],
        default: 'active'
    },
    last_login_at: { type: Date },

    // Organizational Context
    company_id: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to Company collection (if exists later)
    branch_id: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to Branch
    department_id: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to Department

    reporting_manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
}, { timestamps: true });

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password_hash')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
};

module.exports = mongoose.model('User', UserSchema);
