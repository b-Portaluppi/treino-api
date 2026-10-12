import { compare } from "bcrypt";
import { IAuthService } from "../../utils/interface/auth";
import prisma from "../../lib/prisma";
import { sign } from "jsonwebtoken";

export class AuthService {
    async execute({ email, password }: IAuthService) {
        if(!email || !password) return;

        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: email
                }
            })

            if(!user) {
                throw new Error("User not found");
            }

            const passwordCompare = await compare(password, user?.password)

            if(!passwordCompare) {
                throw new Error("Invalid password");
            }

            const token = sign({
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            {
                subject: user.id,
                expiresIn: "30d"
            })

            return {
                name: user.name,
                email: user.email,
                token: token
            }
        }catch (error) {
            throw new Error("Error authenticating user");
        }
    }
}