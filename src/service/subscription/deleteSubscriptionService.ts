import prisma from "../../lib/prisma";
import { DeleteSubscription } from "../../utils/interface/subscription";

export class DeleteSubscriptionService {
    async execute({ id, userId }: DeleteSubscription) {
        if (!id || !userId) throw new Error("Subscription ID and user ID are required");

        try {
            const subscriptionExists = await prisma.subscription.findFirst({
                where: { id, userId }
            });

            if (!subscriptionExists) {
                throw new Error("Subscription not found");
            }

            const subscription = await prisma.subscription.delete({
                where: { id, userId }
            });

            return subscription;
        } catch (error) {
            throw new Error("Error deleting subscription");
        }
    }
}
