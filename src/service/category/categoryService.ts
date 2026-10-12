import prisma from "../../lib/prisma";

export class CategoryService {
    async execute(userId: string) {
        if(!userId) {
            throw new Error("Missing required fields");
        }

        try {
            const response = await prisma.category.findMany({
                where: {
                    userId: userId
                }
            })

            return response;
        } catch (error) {
            throw new Error("Error fetching categories");
        }
    }
}