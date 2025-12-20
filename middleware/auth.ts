import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Intentamos obtener el token del Header 'Authorization' (Bearer Token)
  const authHeader = req.headers.authorization;
  const headerToken = authHeader && authHeader.split(" ")[1];

  // 2. Intentamos obtener el token de las Cookies (como respaldo)
  const cookieToken = req.cookies.access_token;

  // 3. Priorizamos el token del header, si no existe, usamos el de la cookie
  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "No autorizado: Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    
    // Inyectamos el payload decodificado en la request para los siguientes controladores
    req.user = decoded; 
    
    return next(); 
  } catch (error) {
    // Si el token falló, respondemos 401 para que el frontend sepa que debe redirigir al login
    return res.status(401).json({ message: "Sesión expirada o token inválido" });
  }
};