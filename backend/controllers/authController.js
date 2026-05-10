import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const userExists = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (userExists) {
      const conflictField = userExists.email === email ? 'Email' : 'Phone number';
      return res.status(400).json({ message: `${conflictField} already registered` });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Citizen',
      phone,
    });

    if (user) {
      generateToken(res, user._id);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // 'email' field holds either email or phone

    if (!email || !password) {
      return res.status(400).json({ message: 'Email/phone and password are required' });
    }

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all volunteers
// @route   GET /api/auth/volunteers
// @access  Private (Admin)
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'Volunteer' }).select('-password');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
