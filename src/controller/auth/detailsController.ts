import { Request, Response } from "express";
import { DetailsService } from "../../service/auth/detailsService";

export class DetailsController {
    async handle(req: Request, res: Response) {
        const user_id = req.user_id;

        if(!user_id) return;

        const detailsService = new DetailsService();
        const user = await detailsService.execute(user_id);

        return res.status(200).json(user);
    }
}