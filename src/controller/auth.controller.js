import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationCode } from '../config/email.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Admin login with username/password
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username va parol kiritilishi shart' 
      });
    }

    // Find admin user
    const admin = await User.findOne({ 
      $or: [
        { email: username },
        { name: { $regex: new RegExp(username, 'i') } }
      ],
      role: 'admin'
    });
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin foydalanuvchi topilmadi' 
      });
    }

    // Check password
    if (!admin.comparePassword(password)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Noto\'g\'ri parol' 
      });
    }

    // Check if admin is verified
    if (!admin.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin hisobi tasdiqlanmagan' 
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);
            
            // Set cookie
    res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Admin muvaffaqiyatli kirildi',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Admin logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('adminToken');
    res.json({ 
      success: true, 
      message: 'Admin muvaffaqiyatli chiqildi' 
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Add new admin (only super admins can do this)
export const addAdmin = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Barcha maydonlar to\'ldirilishi shart' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan' 
      });
    }

    // Create new admin user
    const adminUser = new User({
      email,
      password,
      name,
      phone,
      role: 'admin',
      isVerified: true // Admin users are auto-verified
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin foydalanuvchi muvaffaqiyatli yaratildi'
    });

  } catch (error) {
    console.error('Add admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Send verification code
export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email kiritilishi shart' 
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bu email bilan foydalanuvchi topilmadi' 
      });
    }

    // Generate verification code
    const code = user.generateVerificationCode();
    await user.save();

    // Send email
    const emailSent = await sendVerificationCode(email, code);
    
    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email yuborishda xatolik yuz berdi' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Autentifikatsiya kodi emailingizga yuborildi' 
    });

  } catch (error) {
    console.error('Send code error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Verify code and login
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email va kod kiritilishi shart' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    // Verify code
    const isValid = user.verifyCode(code);
    
    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Noto\'g\'ri kod yoki kod muddati tugagan' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);
            
            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Muvaffaqiyatli kirildi',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Barcha maydonlar to\'ldirilishi shart' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan' 
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      phone
    });

    // Generate verification code
    const code = user.generateVerificationCode();
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationCode(email, code);
    
    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email yuborishda xatolik yuz berdi' 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Foydalanuvchi yaratildi. Autentifikatsiya kodi emailingizga yuborildi'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
        res.clearCookie('token');
    res.json({ 
      success: true, 
      message: 'Muvaffaqiyatli chiqildi' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -verificationCode');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
};