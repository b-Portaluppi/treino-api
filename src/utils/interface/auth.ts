export interface ICreateAuthService {
    email: string;
    name: string;
    password: string;
}

export interface IAuthService {
    email: string;
    password: string;
}

export interface IUpdateAuthService {
    id: string,
    stripe_customer_id: string
}