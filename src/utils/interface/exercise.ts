export interface ICreateExercise {
    name: string;
    description: string;
    load: number;
    repetition: number;
    categoryId: string;
}

export interface IUpdateExercise {
    id: string;
    name?: string;
    description?: string;
    load?: number;
    repetition?: number;
}