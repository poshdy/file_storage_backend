import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { TIdentifer, User } from 'src/types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
  async create(userData: User) {
    return await this.userRepo.createUser(userData);
  }
  async getUser(data: string, identifer: TIdentifer) {
    return await this.userRepo.getUser(data, identifer);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  async updateHash(email: string, newHash: string) {
    return await this.userRepo.updatePassword(email, newHash);
  }
  updateRt(id: string, hashedRt: string) {
    return this.userRepo.updateRt(id, hashedRt);
  }

  async getResetToken(token: string) {
    return await this.userRepo.getResetToken(token);
  }

  async createResetToken(userId: string, token: string, expiresAt: string) {
    return await this.userRepo.saveResetToken(userId, token, expiresAt);
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async logOut(userId: string) {
    return await this.userRepo.removeRt(userId);
  }
  async updateAccountStatus(userId: string) {
    return await this.userRepo.updateAccStatus(userId)
  }
}
