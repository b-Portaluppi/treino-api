import prisma from "../../lib/prisma";
import { ICreateExercise } from "../../utils/interface/exercise";

export class CreateExerciseService {
    async execute({ name, description, load, repetition, categoryId }: ICreateExercise) {
        const categoryExists = await prisma.category.findFirst({
            where: {
                id: categoryId
            }
        })

        if (!categoryExists) {
            throw new Error("Category does not exist");
        }

        try {
            const exercise = await prisma.exercise.create({
                data: {
                    name,
                    description,
                    load,
                    repetition,
                    categoryId
                }
            })
            
            return exercise;
        } catch (error) {
            throw new Error("Error creating exercise");
        }
    }
}