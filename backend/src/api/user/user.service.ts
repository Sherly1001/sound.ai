import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialUser } from 'src/dtos/user.dto';
import { User } from 'src/schema/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

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
    try {
      const res = await this.userRepo.save(user);
      return res;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new UnprocessableEntityException(err.driverError.detail);
      } else {
        throw err;
      }
    }
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
    try {
      const user = await this.userRepo.findOneBy({ userId });
      if (!user) throw new NotFoundException(`UserId ${userId} not found`);

      const newUser = Object.assign(new User(), { ...user, ...payload });
      if (isAdmin) {
        newUser.isAdmin = true;
      }

      return await this.userRepo.save(newUser);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new UnprocessableEntityException(
          err.driverError.detail ?? err.message,
        );
      } else {
        throw err;
      }
    }
  }
}
