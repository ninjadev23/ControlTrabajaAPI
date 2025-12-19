import { Router, RequestHandler } from "express";
import { UserModel } from "../models/Users";
import { verifyToken } from "../middleware/auth";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import { handleError } from "../utils";

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/profile", verifyToken as RequestHandler, async (req: any, res) => {
  try {
    const user = await UserModel.findById(req.user.userID).select("-password");
    res.json(user);
  } catch (err) {
    handleError(res, err as Error);
  }
});

router.put("/update-profile", verifyToken as RequestHandler, upload.single("fotoPerfil"), async (req: any, res) => {
  try {
    const userId = req.user.userID;
    
    const { name, email, password, nationality, birthdate } = req.body;
    const updateData: any = { 
        name, 
        email, 
        nationality, 
        birthdate 
    };

    if (req.file) {
      console.log("Archivo recibido:", req.file.filename);
      updateData.profilePhoto = `https://controltrabajaapi-production.up.railway.app/uploads/${req.file.filename}`;
    }

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { $set: updateData }, 
      { new: true, runValidators: true } 
    ).select("-password");

    if (!updatedUser) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }

    console.log("Usuario actualizado en DB:", updatedUser.name);
    res.json({ message: "Perfil actualizado", user: updatedUser });

  } catch (err) {
    console.error("Error en update-profile:", err);
    handleError(res, err as Error);
  }
});

export default router;