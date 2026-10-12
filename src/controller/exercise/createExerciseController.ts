import { Request, Response } from "express";
import { CreateExerciseService } from "../../service/exercise/createExerciseService";

export class createExerciseController {
    async handle(req: Request, res: Response) {
        const { name, description, load, repetition, categoryId } = req.body;

        if (!name || !description || !load || !repetition || !categoryId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const createExerciseService = new CreateExerciseService();
        const exercise = await createExerciseService.execute({ name, description, load, repetition, categoryId });

        return res.status(201).json(exercise);
    }
}