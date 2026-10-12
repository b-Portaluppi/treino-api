import { Request, Response } from "express";
import { CreateSubscriptionService } from "../../service/subscription/createSubscriptionService";
import { Plan } from "../../generated/prisma/enums";

export class CreateSubscriptionController {
    async handle(req: Request, res: Response) {
        const { status, plan, priceId } = req.body;
        const userId = req.user_id;

        if (!status || !Object.values(Plan).includes(plan) || !priceId || !userId) {
            return res.status(400).json({ error: "Status, plan, and priceId are required" });
        }

        const service = new CreateSubscriptionService();
        const subscription = await service.execute({ status, plan, priceId, userId });
        return res.status(201).json(subscription);
    }
}
