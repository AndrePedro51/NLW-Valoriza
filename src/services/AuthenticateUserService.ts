import { getCustomRepository } from "typeorm";
import { UserRepositories } from "../repositories/UsersRepositories";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

interface IAuthenticateRequest {
    email: string,
    password: string
}

class AuthenticateUserService{
    async execute({email, password}: IAuthenticateRequest){
        const usersRepositories = getCustomRepository(UserRepositories)

        const user = await usersRepositories.findOne({
            email
        })

        if(!user){
            throw new Error("Email/Password incorrect")
        }

        const passowordMatch = await compare(password, user.password)

        if(!passowordMatch){
            throw new Error("Email/Password incorrect")
        }

        const token = sign({
                email: user.email
            }, "e81d1dd01a78ed1de67e13f67a5dddf8", {
                subject: user.id,
                expiresIn: "1d"
            }
        );

        return token

    }
}

export {AuthenticateUserService}