const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

// All user routes are protected by authentication
router.use(protect);

router.get('/', checkPermission('users', 'view'), getUsers);

router.post("/", checkPermission('users', 'create'), createUser);

router.route('/:id')
    .get(checkPermission('users', 'view'), getUserById)
    .put(checkPermission('users', 'edit'), updateUser)
    .delete(checkPermission('users', 'delete'), deleteUser);

module.exports = router;
