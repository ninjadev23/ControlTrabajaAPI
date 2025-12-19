import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import UserRouter from "./routes/users"
import ProfileRouter from "./routes/profile"
import dotenv from "dotenv"
import passport from 'passport';
import fs from 'fs';
import path from "path";

dotenv.config()
import "./configDB"
import './config/passport';

const app = express()

app.set("trust proxy", 1);
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "https://control-trabaja.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    console.log("Creando carpeta uploads...");
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));
app.use("/api", UserRouter)
app.use("/api", ProfileRouter)
app.use(passport.initialize());

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log(`Application running on http://localhost:${PORT}`))