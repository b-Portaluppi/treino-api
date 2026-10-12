import prisma from "../../lib/prisma";
import { UpdateCategory } from "../../utils/interface/category";

export class UpdateCategoryService {
    async execute({ name, id, userId }: UpdateCategory) {
        if (!name || !id || !userId) {
            throw new Error("Name, id, and userId are required");
        }

        try {
          const category = await prisma.category.update({
            where: {
                id: id,
                userId: userId
            },
            data: {
                name: name
            }
          })

            return category;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating category" );
        }
    }
}