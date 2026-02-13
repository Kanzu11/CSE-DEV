const express = require('express');
const passport = require('passport');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/signup`, session: false }),
    (req, res) => {
        const token = require('../controllers/authController').generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth-success?token=${token}`);
    }
);

module.exports = router;
