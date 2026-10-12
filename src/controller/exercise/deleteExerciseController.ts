import { Response, Request } from "express";
import { DeleteExerciseService } from "../../service/exercise/deleteExerciseService";

export class DeleteExerciseController {
    async handle(req: Request, res: Response) {
        const { id } = req.params as { id: string };

        if(!id) {
           return res.status(400).json({ error: "Exercise ID is required." });
        }

        const deleteExerciseService = new DeleteExerciseService();
        const response = await deleteExerciseService.execute(id);

        return res.status(200).json(response);
    }
}