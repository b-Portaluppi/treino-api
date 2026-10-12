import { Request, Response } from "express";
import { CreateAuthService } from "../../service/auth/createAuthService";

export class CreateAuthController {
    async handle(req: Request, res: Response) {
        const { email, password, name } = req.body;

        if(!email || !password || !name) return;

        const createAuthService = new CreateAuthService();
        const authUser = await createAuthService.execute({ email, password, name });

        return res.status(201).json(authUser);
    }
}