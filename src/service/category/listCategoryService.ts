import prisma from "../../lib/prisma";

export class ListCategoryService {
    async execute(id: string) {
        if(!id) {
            throw new Error("Missing required fields");
        }

        try {
            const response = await prisma.category.findFirst({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true,
                    exercises: {
                        select: {
                            categoryId: true,
                            createdAt: true,
                            description: true,
                            id: true,
                            load: true,
                            name: true,
                            repetition: true,
                            updatedAt: true
                        }
                    }
                }
            })

            return response;
        } catch (error) {
            throw new Error("Error fetching categories");
        }
    }
}