import { IsString ,} from "class-validator"




export class FolderData {
    @IsString({message:"folder name must be string"})
    name: string
    // @IsString({message:"user id required to perform this action"})
    // userId:string
}