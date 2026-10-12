import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface payload {
    sub: string;
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if(!authToken) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const [, token] = authToken.split(" ");

        const { sub } = verify(token!, process.env.JWT_SECRET as string) as payload;

        req.user_id = sub;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}