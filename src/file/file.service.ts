import { Injectable } from '@nestjs/common';
import { FileRepo } from './file.repo';

@Injectable()
export class FileService {
 constructor(private readonly fileRepo: FileRepo){}
    async getFiles(){
        return this.fileRepo.getFiles()
    }
    async getfile(id:string){
        return this.fileRepo.getFile(id)
    }
    async deleteFile(id:string){
        return this.fileRepo.deleteFile(id)
    }
}
