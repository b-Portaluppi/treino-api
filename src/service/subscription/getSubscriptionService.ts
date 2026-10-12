import prisma from "../../lib/prisma";

export class GetSubscriptionService {
    async execute(userId: string) {
        if (!userId) throw new Error("User ID is required");

        try {
            const subscription = await prisma.subscription.findFirst({
                where: { userId }
            });

            return subscription;
        } catch (error) {
            throw new Error("Error fetching subscription");
        }
    }
}
