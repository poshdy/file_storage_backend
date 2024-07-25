import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  async getUser(id: string) {
    return await this.database.user.findUnique({
      where: { id },
    });
  }
  async createUser() {
    return await this.database.user.create({
      data: {
        email: '',
        hash: '',
        name: '',
      },
    });
  }
  async deleteUser(id: string) {
    return await this.database.user.delete({
      where: {
        id,
      },
    });
  }
}
