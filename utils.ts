import jwt from "jsonwebtoken"
import { Response } from "express";
import { ZodError } from "zod";
import { HttpError, UserSession } from "./types"
export const verifySession = (token: string): UserSession=>{
    if(!token) throw new HttpError("User Not Authenticated", 401)
    const UserSession = jwt.verify(token, (process.env.SECRET_KEY as string)) as UserSession
    return UserSession        
}
export const handleError = (res: Response, err: HttpError | Error): void =>{
    console.log(err);
    if(err instanceof ZodError) {
        // Formatea los errores de Zod para mayor legibilidad
        const errors = err.errors.map(e => ({
            path: e.path,
            error: e.message
        }));
        res.status(400).json({ error: errors, status: 400 });
    }else{
        const statusCode = (err instanceof HttpError && err.status) || 400;
        res.status(statusCode).json({
            error: err.message,
            status: statusCode
        });
    }
}
