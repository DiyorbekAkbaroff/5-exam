import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.js';
import { updateProfileSchema } from '../validation/schemas.js';
import {
  getProfile,
  updateProfile,
  getAdminDashboard
} from '../controller/profile.controller.js';

const profileRouter = Router();

// All profile routes require authentication
profileRouter.use(requireAuth);

// Get user profile
profileRouter.get('/', getProfile);

// Update user profile
profileRouter.put('/',
  validate(updateProfileSchema),
  updateProfile
);

// Admin dashboard (Admin only)
profileRouter.get('/admin/dashboard',
  requireAdmin,
  getAdminDashboard
);

export { profileRouter };
