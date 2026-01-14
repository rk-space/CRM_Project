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

            // Day 2 Granular Permissions for Users module
            { module: 'auth', resource: 'users', action: 'view', scope: 'branch' },
            { module: 'auth', resource: 'users', action: 'view', scope: 'own' },
            { module: 'auth', resource: 'users', action: 'create', scope: 'all' },
            { module: 'auth', resource: 'users', action: 'edit', scope: 'all' },
            { module: 'auth', resource: 'users', action: 'edit', scope: 'branch' },
            { module: 'auth', resource: 'users', action: 'edit', scope: 'own' },
            { module: 'auth', resource: 'users', action: 'delete', scope: 'all' },
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
            permissions: []
        });

        const branchManagerRole = await Role.create({
            role_name: 'Branch Manager',
            description: 'Can manage users in their own branch',
            is_system_role: true,
            permissions: createdPermissions.filter(p =>
                (p.resource === 'users' && p.scope === 'branch') ||
                (p.resource === 'leads' && p.scope === 'all')
            ).map(p => p._id)
        });

        console.log('Roles Created...');

        // 3. Create Users
        const commonBranchId = new mongoose.Types.ObjectId();

        const adminUser = new User({
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            password_hash: 'password123',
            roles: [adminRole._id],
            status: 'active',
            branch_id: commonBranchId
        });

        await adminUser.save();

        const managerUser = new User({
            first_name: 'Branch',
            last_name: 'Manager',
            email: 'manager@example.com',
            password_hash: 'password123',
            roles: [branchManagerRole._id],
            status: 'active',
            branch_id: commonBranchId
        });

        await managerUser.save();

        const otherUser = new User({
            first_name: 'Other',
            last_name: 'Employee',
            email: 'other@example.com',
            password_hash: 'password123',
            roles: [userRole._id],
            status: 'active',
            branch_id: new mongoose.Types.ObjectId() // Different branch
        });

        await otherUser.save();

        console.log('Admin, Manager, and Other User Created...');

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
