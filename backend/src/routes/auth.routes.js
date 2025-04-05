const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const passport = require('passport');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const jwtToken = require('../utils/jwt').generateToken(req.user._id.toString());
    
    require('../utils/jwt').setTokenCookie(res, jwtToken);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`);
  }
);

router.post('/setup-otp', authenticateJWT, authController.setupOTP);
router.post('/verify-otp', authenticateJWT, authController.verifyAndEnableOTP);
router.post('/disable-otp', authenticateJWT, authController.disableOTP);
router.post('/verify-login-otp', authController.verifyOTPForLogin);

module.exports = router; 