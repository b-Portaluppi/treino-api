import { Request, Response } from 'express';
import { AuthService } from '../../service/auth/authService';

export class AuthController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;

        if(!email || !password) return;

        const authService = new AuthService();
        const user = await authService.execute({ email, password });

        return res.status(200).json(user);
    }
}