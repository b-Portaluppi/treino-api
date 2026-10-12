import prisma from "../../lib/prisma";
import { DeleteCategory } from "../../utils/interface/category";

export class DeleteCategoryService {
    async execute({ id, userId }: DeleteCategory) {
        if(!id || !userId) {
            throw new Error("Missing required fields");
        }

        try{
            const response = await prisma.category.delete({
                where: {
                    id: id,
                    userId: userId
                }
            })

            return response;
        } catch (error) {
            throw new Error("Error deleting category ");
        }
    }
}