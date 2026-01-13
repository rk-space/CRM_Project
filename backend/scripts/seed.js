const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        // Clear existing data
        await Permission.deleteMany();
        await Role.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        // 1. Create Permissions
        const permissionsData = [
            { module: 'crm', resource: 'leads', action: 'view', scope: 'all' },
            { module: 'crm', resource: 'leads', action: 'create', scope: 'all' },
            { module: 'sales', resource: 'invoices', action: 'view', scope: 'own' },
            { module: 'auth', resource: 'users', action: 'view', scope: 'all' },
            // Add more as needed for Day 1
        ];

        const createdPermissions = await Permission.insertMany(permissionsData);
        console.log('Permissions Created...');

        // 2. Create Roles
        const adminRole = await Role.create({
            role_name: 'Super Admin',
            description: 'Full access to everything',
            is_system_role: true,
            permissions: createdPermissions.map(p => p._id) // Give all permissions
        });

        const userRole = await Role.create({
            role_name: 'User',
            description: 'Standard user',
            is_system_role: true,
            permissions: [] // Basic user might have limited or no explicit permissions initially
        });

        console.log('Roles Created...');

        // 3. Create Admin User
        const adminUser = new User({
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            password_hash: 'password123', // Will be hashed by pre-save
            role_name: 'Super Admin', // Just for reference
            roles: [adminRole._id],
            status: 'active'
        });

        await adminUser.save();
        console.log('Admin User Created...');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroy data if needed
} else {
    connectDB().then(importData);
}
