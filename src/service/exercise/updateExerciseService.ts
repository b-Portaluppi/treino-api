import prisma from "../../lib/prisma";
import { IUpdateExercise } from "../../utils/interface/exercise";

export class UpdateExerciseService {
    async execute({ name, description, load, repetition, id }: IUpdateExercise) {
        if (!name && !description && !load && !repetition && !id) {
            throw new Error("At least one field must be provided for update.");
        }

        try{
            const existExercise = await prisma.exercise.findFirst({
                where: {
                    id: id
                }
            });

            if (!existExercise) {
                throw new Error("Exercise not found.");
            }

            const response = await prisma.exercise.update({
                where: {
                    id: id
                },
                data: {
                    name: name || existExercise.name,
                    description: description || existExercise.description,
                    load: load || existExercise.load,
                    repetition: repetition || existExercise.repetition
                }
            });

            return response;
        } catch (error) {
            throw new Error("Error occurred while updating exercise.");
        }
    }
}
