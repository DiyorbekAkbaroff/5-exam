import mongoose from 'mongoose';
import crypto from 'crypto-js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    code: String,
    expiresAt: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = crypto.SHA256(this.password).toString();
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === crypto.SHA256(candidatePassword).toString();
};

// Method to generate verification code
userSchema.methods.generateVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  this.verificationCode = {
    code,
    expiresAt
  };
  
  return code;
};

// Method to verify code
userSchema.methods.verifyCode = function(code) {
  if (!this.verificationCode || !this.verificationCode.code) {
    return false;
  }
  
  if (new Date() > this.verificationCode.expiresAt) {
    this.verificationCode = undefined;
    return false;
  }
  
  if (this.verificationCode.code === code) {
    this.isVerified = true;
    this.verificationCode = undefined;
    return true;
  }
  
  return false;
};

export default mongoose.model('User', userSchema); 