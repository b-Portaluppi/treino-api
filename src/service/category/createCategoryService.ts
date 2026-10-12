import prisma from "../../lib/prisma";
import { CreateCategory } from "../../utils/interface/category";

export class CreateCategoryService {
    async execute({ name, userId }: CreateCategory) {
        if (!name || !userId) {
            throw new Error("Name and userId are required");
        }

        try {
            const category = await prisma.category.create({
                data: {
                    name,
                    userId
                }
            })

            return category;
        } catch (error) {
            console.log(error);
            throw new Error("Error creating category" );
        }
    }
}