import prisma from "../../lib/prisma";
import { IUpdateAuthService } from "../../utils/interface/auth";

export class UpdateAuthService {
    async execute({ stripe_customer_id, id }: IUpdateAuthService) {
        if(!stripe_customer_id || !id) {
            throw new Error("Failed customer ID")
        }

        const userExist = await prisma.user.findFirst({
            where: {
                id: id
            }
        })

        if(!userExist) {
            throw new Error("User not exist")
        }

        try {
            const response = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    stripe_customer_id: stripe_customer_id
                }
            })

            return response
        }catch(e) {
            return {
                error: e,
           }
        }
    }
}
