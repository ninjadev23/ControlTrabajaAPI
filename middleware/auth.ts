import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = decoded; 
    
    return next(); 
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};