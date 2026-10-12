import { Request, Response } from "express";
import { UpdateExerciseService } from "../../service/exercise/updateExerciseService";

export class UpdateExerciseController {
    async handle(req: Request, res: Response) {
        const { name, description, load, repetition } = req.body;
        const { id } = req.params as { id: string };

        if(!name && !description && !load && !repetition) {
            return res.status(400).json({ error: "At least one field must be provided for update." });
        }

        if(!id) {
            return res.status(400).json({ error: "Exercise ID is required." });
        }

        const updateExerciseService = new UpdateExerciseService();
        const response = await updateExerciseService.execute({ name, description, load, repetition, id });

        return res.status(200).json(response);
    }
}