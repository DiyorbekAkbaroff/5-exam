import express from "express";
import path from "path";
import layout from "express-ejs-layouts";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { viewRouter } from "./routes/view.routes.js";
import { mainRouter } from "./routes/main.routes.js";
import { optionalAdminAuth } from "./middleware/admin.middleware.js";

// API routerlar
// Old routes removed - now using mainRouter

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Layout va frontend sozlamalari
app.set("layout", "layout/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(layout);

// Body parserlar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  🔑  Har safar render bo'lganda EJS uchun user ni global qilish
app.use((req, res, next) => {
    res.locals.user = req.user || null; // req.user bo'lmasa null bo'ladi
    res.locals.admin = req.admin || null; // req.admin bo'lmasa null bo'ladi
    next();
});  

// View yo'nalishlari
app.use(viewRouter);

// API yo'nalishlari
app.use("/api", mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render("pages/404", { title: "Page Not Found" });
});

// Connect to MongoDB
connectDB();

// Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
