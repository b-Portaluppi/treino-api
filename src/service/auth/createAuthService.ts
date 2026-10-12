import { hash } from "bcrypt";
import prisma from "../../lib/prisma";
import { ICreateAuthService } from "../../utils/interface/auth";

export class CreateAuthService { 
    async execute({ email, name, password }: ICreateAuthService) {
        const userExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(userExists) {
            throw new Error("User already exists");
        }

        try {
            const passowordHash = await hash(password, 8);

            const user = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: passowordHash
                }
            })

            return user;
        } catch (error) {
            throw new Error("Error creating user");
        }
    }
}