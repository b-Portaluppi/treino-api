import prisma from "../../lib/prisma";
import { UpdateSubscription } from "../../utils/interface/subscription";

export class UpdateSubscriptionService {
    async execute({ id, userId, status, plan, priceId }: UpdateSubscription) {
        if (!id || !userId) throw new Error("Subscription ID and user ID are required");

        try {
            const subscriptionExists = await prisma.subscription.findFirst({
                where: { id, userId }
            });

            if (!subscriptionExists) {
                throw new Error("Subscription not found");
            }

            const subscription = await prisma.subscription.update({
                where: { id, userId },
                data: { status, plan, priceId }
            });

            return subscription;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating subscription");
        }
    }
}
