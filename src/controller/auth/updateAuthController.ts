import { Request, Response } from "express";
import { UpdateAuthService } from "../../service/auth/updateAuthService";

export class UpdateAuthController {
    async handle(req: Request, res: Response) {
        const { id, stripe_customer_id } = req.body;

        if(!stripe_customer_id || !id) {
            throw new Error("Failed customer ID")
        }

        const updateAuthService = new UpdateAuthService();
        const user = await updateAuthService.execute({ id, stripe_customer_id })

        return res.status(200).json(user)
    }
}