import { Request, Response } from "express";
import { DeleteCategoryService } from "../../service/category/deleteCategoryService";

export class deleteCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        const { userId } = req.body;

        if(!id || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const deleteCategoryService = new DeleteCategoryService();
        const deletedCategory = await deleteCategoryService.execute({ id, userId });

        return res.status(200).json(deletedCategory);
    }
}