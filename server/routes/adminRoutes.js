const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/adminController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, superAdmin, getUsers);
router.route('/users/:id/role').put(protect, superAdmin, updateUserRole);

module.exports = router;
