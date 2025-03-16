import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    const key = process.env.JWT_SECRET || "default";
    jwt.verify(token, key, (err, decoded) => {
        if (err || !decoded || typeof(decoded) === "string") {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.body.userId = decoded.id;
        next();
    });
}

export default authMiddleware;