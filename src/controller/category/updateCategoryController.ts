import { Response, Request } from "express";
import { UpdateCategoryService } from "../../service/category/updateCategoryService";

export class UpdateCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        const { name, userId } = req.body;

        if (!name || !id || !userId) {
            return res.status(400).json({ error: "Name, id, and userId are required" });
        }

        const updateCategoryService = new UpdateCategoryService();
        const category = await updateCategoryService.execute({ name, userId, id });
        return res.status(200).json(category);
    }
}