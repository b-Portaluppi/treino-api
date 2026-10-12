import { Plan } from "../../generated/prisma/enums";

export interface CreateSubscription {
    status: string;
    plan: Plan;
    priceId: string;
    userId: string;
}

export interface UpdateSubscription {
    id: string;
    userId: string;
    status?: string;
    plan?: Plan;
    priceId?: string;
}

export interface DeleteSubscription {
    id: string;
    userId: string;
}
