import prisma from "../../lib/prisma";

export class DetailsService {
    async execute(user_id: string) {
        if(!user_id) {
            throw new Error("User ID is required");
        }

        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: user_id
                }
            });

            return user;
        } catch (error) {
            throw new Error("Error occurred while fetching user details");
        }
    }
}