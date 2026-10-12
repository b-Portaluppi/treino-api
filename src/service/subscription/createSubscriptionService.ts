import prisma from "../../lib/prisma";
import { CreateSubscription } from "../../utils/interface/subscription";

export class CreateSubscriptionService {
    async execute({ status, plan, priceId, userId }: CreateSubscription) {
        if (!status || !plan || !priceId || !userId) {
            throw new Error("Status, plan, priceId, and userId are required");
        }

        try {
            const subscription = await prisma.subscription.create({
                data: { status, plan, priceId, userId }
            });

            return subscription;
        } catch (error) {
            console.log(error);
            throw new Error("Error creating subscription");
        }
    }
}
