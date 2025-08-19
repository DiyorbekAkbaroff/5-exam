import { Router } from "express";
import { 
  sendCode, 
  verifyCode, 
  register, 
  logout, 
  getCurrentUser,
  adminLogin,
  adminLogout,
  addAdmin
} from "../controller/auth.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const authRouter = Router();

// User authentication routes
authRouter.post("/send-code", sendCode);
authRouter.post("/verify-code", verifyCode);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getCurrentUser);

// Admin authentication routes
authRouter.post("/admin/login", adminLogin);
authRouter.post("/admin/logout", adminLogout);
authRouter.post("/admin/add", requireAuth, requireAdmin, addAdmin);

export { authRouter };