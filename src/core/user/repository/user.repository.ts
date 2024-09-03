import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/prisma/prisma.service';
import { TIdentifer, User } from 'src/types/user.types';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  async getUser(data: string, identifer: TIdentifer) {
    if (identifer == 'email') {
      return await this.database.user.findUnique({
        where: {
          email: data,
        },
      });
    } else {
      return await this.database.user.findUnique({
        where: {
          id: data,
        },
      });
    }
  }

  async createUser(data: User) {
    return await this.database.user.create({
      data: {
        email: data.email,
        hash: data.hash,
        name: data.name,
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
  async updateRt(id: string, hashedRt: string) {
    return await this.database.user.update({
      where: {
        id,
      },
      data: {
        hashedRt,
      },
    });
  }
  async removeRt(id: string) {
    return await this.database.user.update({
      where: {
        id,
      },
      data: {
        hashedRt: '',
      },
    });
  }

  async updatePassword(email: string, newHash: string) {
    return await this.database.user.update({
      where: {
        email,
      },
      data: {
        hash: newHash,
      },
    });
  }

  async saveResetToken(userId: string, token: string, expiresAt: string) {
    return await this.database.resetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async getResetToken(token: string) {
    return await this.database.resetToken.findUnique({
      where: {
        token,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  }
  async updateAccStatus(userId: string) {
    return await this.database.user.update({
      where: {
        id: userId,
      },
      data: {
        verified: true,
      },
    });
  }
}
