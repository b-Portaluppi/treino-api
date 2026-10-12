import { Request, Response } from "express";
import { UpdateSubscriptionService } from "../../service/subscription/updateSubscriptionService";
import { Plan } from "../../generated/prisma/enums";

export class UpdateSubscriptionController {
    async handle(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        const { status, plan, priceId } = req.body;
        const userId = req.user_id;

        if (!id || !userId || (!status && !plan && !priceId) || (plan !== undefined && !Object.values(Plan).includes(plan))) {
            return res.status(400).json({ error: "Subscription ID and at least one field are required" });
        }

        const service = new UpdateSubscriptionService();
        const subscription = await service.execute({ id, userId, status, plan, priceId });
        return res.status(200).json(subscription);
    }
}
