import prisma from "../../lib/prisma";

export class DeleteExerciseService {
    async execute(id: string) {
        if (!id) {
            throw new Error("Exercise ID is required.");
        }

        try {
            const exerciseExist = await prisma.exercise.findFirst({
                where: {
                    id: id
                }
            })

            if(!exerciseExist) {
                throw new Error("Exercise is not exist")
            }

            const response = await prisma.exercise.delete({
                where: {
                    id: id
                }
            })

            return response;
        } catch (error) {
            throw new Error("Error deleting exercise");
        }
    }
}