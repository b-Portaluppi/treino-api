import { Request, Response } from "express";
import { CategoryService } from "../../service/category/categoryService";

export class CategoryController {
    async handle(req: Request, res: Response) {
        const user_id = req.user_id as string;

        const categoryService = new CategoryService();
        const response = await categoryService.execute(user_id);  

        return res.json(response);
    }
}