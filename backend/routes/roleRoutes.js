const express = require('express');
const router = express.Router();
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect); // Protect all role routes

router.route('/')
    .post(restrictTo('Admin'), createRole)
    .get(restrictTo('Admin', 'Manager'), getAllRoles);

router.route('/:id')
    .get(restrictTo('Admin', 'Manager'), getRoleById)
    .put(restrictTo('Admin'), updateRole)
    .delete(restrictTo('Admin'), deleteRole);

module.exports = router;
