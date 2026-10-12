import { Request, Response } from "express";
import { DeleteSubscriptionService } from "../../service/subscription/deleteSubscriptionService";

export class DeleteSubscriptionController {
    async handle(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        const userId = req.user_id;

        if (!id || !userId) return res.status(400).json({ error: "Subscription ID is required" });

        const service = new DeleteSubscriptionService();
        const subscription = await service.execute({ id, userId });
        return res.status(200).json(subscription);
    }
}
