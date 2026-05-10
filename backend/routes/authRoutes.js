import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getVolunteers,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import passport from 'passport';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/volunteers', protect, admin, getVolunteers);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login` }),
  (req, res) => {
    // Successful authentication, generate token and redirect
    generateToken(res, req.user._id);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
  }
);

export default router;
