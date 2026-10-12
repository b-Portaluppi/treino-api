export interface CreateCategory {
    name: string;
    userId: string;
}

export interface UpdateCategory {
    name: string;
    id: string;
    userId: string;
}

export interface DeleteCategory {
    id: string;
    userId: string;
}