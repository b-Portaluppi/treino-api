import { Request, Response } from "express";
import { GetSubscriptionService } from "../../service/subscription/getSubscriptionService";

export class GetSubscriptionController {
    async handle(req: Request, res: Response) {
        const userId = req.user_id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const service = new GetSubscriptionService();
        const subscription = await service.execute(userId);
        if (!subscription) return res.status(404).json({ error: "Subscription not found" });
        return res.status(200).json(subscription);
    }
}
