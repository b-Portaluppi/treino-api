import { Request, Response } from "express";
import { ListCategoryService } from "../../service/category/listCategoryService";

export class ListCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const listCategoryService = new ListCategoryService();
        const response = await listCategoryService.execute(id as string);

        return res.json(response);
    }
}