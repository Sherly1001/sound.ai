import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialUser } from 'src/dtos/user.dto';
import { User } from 'src/schema/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(
    username: string,
    password: string,
    isAdmin: boolean = false,
  ) {
    const user = this.userRepo.create({
      username,
      hashPassword: password,
      isAdmin,
    });
    return await this.userRepo.save(user);
  }

  async verifyUser(username: string, password: string) {
    const user = await this.userRepo.findOneBy({ username });
    if (!user || !user.checkPassword(password)) return null;
    return user;
  }

  async updateUser(
    userId: string,
    payload: PartialUser,
    isAdmin: boolean = false,
  ) {
    const user = await this.userRepo.findOneBy({ userId });
    if (!user) throw new NotFoundException(`UserId ${userId} not found`);

    const newUser = Object.assign(new User(), { ...user, ...payload });
    if (isAdmin) {
      newUser.isAdmin = true;
    }

    return await this.userRepo.save(newUser);
  }
}
