import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { compare, hash } from 'bcrypt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount(userData: CreateUserDto): Promise<Tokens> {
    const isExist = await this.userService.getUser(userData.email, 'email');
    if (isExist) {
      throw new Error('This Email is already used');
    }
    const hash = await this.hashData(userData.password);
    const newUser = await this.userService.create({
      email: userData.email,
      hash,
      name: userData.name,
    });

    const { access_token, refresh_token } = await this.generateTokens(
      newUser.email,
      newUser.id,
    );
    await this.userService.updateRt(newUser.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }
  async logIn(userData: UpdateUserDto): Promise<Tokens> {
    const user = await this.userService.getUser(userData?.email, 'email');
    if (!user) throw new UnauthorizedException('Access Denied');
    const isPassMatch = await this.compareHash(userData.password, user.hash);
    if (!isPassMatch) throw new UnauthorizedException('Access Denied');
    const { access_token, refresh_token } = await this.generateTokens(
      user.email,
      user.id,
    );
    await this.updateRt(user.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }
  async createAccountWithGoogle(email: string, name: string) {
    const isExist = await this.userService.getUser(email, 'email');
    if (isExist) {
      throw new Error('This Email is already used');
    }
    const newUser = await this.userService.create({
      email,
      name,
    });

    const { access_token, refresh_token } = await this.generateTokens(
      newUser.id,
      newUser.email,
    );
    await this.userService.updateRt(newUser.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async logOut(userId: string) {
    await this.userService.logOut(userId);
  }

  async refreshToken(rt: string, userId: string) {
    const user = await this.userService.getUser(userId, 'id');
    if (!user) throw new ForbiddenException('access denied');
    const isRtMatch = await this.compareHash(rt, user.hash);
    if (!isRtMatch) throw new ForbiddenException('access denied');
    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.email,
    );
    await this.updateRt(user.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async updateRt(userId: string, rt: string) {
    const refresh_token = await this.hashData(rt);
    return await this.userService.updateRt(userId, refresh_token);
  }
  async generateTokens(email: string, id: string): Promise<Tokens> {
    const user = {
      email,
      id,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(user, {
        expiresIn: 60 * 15,
        secret: process.env.ACCESS_TOKEN_SECRET,
      }),
      this.jwtService.signAsync(user, {
        expiresIn: 60 * 60 * 24 * 10,
        secret: process.env.ACCESS_TOKEN_SECRET,
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashData(data: string) {
    return await hash(data, 10);
  }

  async compareHash(data: string, hash: string) {
    return await compare(data, hash);
  }
}
