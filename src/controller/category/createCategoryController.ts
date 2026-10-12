import { Response, Request } from "express";
import { CreateCategoryService } from "../../service/category/createCategoryService";

export class CreateCategoryController {
    async handle(req: Request, res: Response) {
        const { name, userId } = req.body;

        if (!name || !userId) {
            return res.status(400).json({ error: "Name and userId are required" });
        }
        
        const createCategoryService = new CreateCategoryService();
        const category = await createCategoryService.execute({ name, userId });
        return res.status(201).json(category);
    }
}