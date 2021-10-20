import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"
import { UserRepositories } from "../repositories/UsersRepositories"


interface IComplimentRequest{
    tag_id: string;
    user_sender: string;
    user_receiver: string;
    message: string
}

class CreateComlimentService{
    async execute({tag_id, user_sender, user_receiver, message}: IComplimentRequest){
        const complimentsRepositories = getCustomRepository(
            ComplimentsRepositories
        )
        const userRepositories = getCustomRepository(UserRepositories)

        if(user_sender === user_receiver){
            throw new Error("Incorrect User Receiver")
        }

        const userReceiverExist = await userRepositories.findOne(user_receiver)

        if(!userReceiverExist){
            throw new Error("User Receiver dos not exist!")
        }

        const compliment = complimentsRepositories.create({
            tag_id,
            user_receiver,
            user_sender,
            message
        })

        await complimentsRepositories.save(compliment)

        return compliment

    }
}

export { CreateComlimentService }