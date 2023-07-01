import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListUserParams, PartialUser } from 'src/dtos/user.dto';
import { User } from 'src/schema/entities';
import { sqlContains } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getUser(userId: string) {
    return await this.userRepo.findOneBy({ userId });
  }

  async getUsers(params: ListUserParams) {
    const query = this.userRepo.createQueryBuilder().setParameters(params);

    if (params.username) {
      sqlContains(query, 'User.username', 'username');
    }

    if (typeof params.isAdmin != 'undefined') {
      query.andWhere('User.isAdmin = :isAdmin');
    }

    if (params.page > 0) {
      query.skip(params.limit * (params.page - 1));
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.orderBy) {
      const asc = params.orderASC ? params.orderASC == 'true' : true;
      query.orderBy('User.' + params.orderBy, asc ? 'ASC' : 'DESC');
    }

    return await query.getManyAndCount();
  }

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

    if (!user.checkPassword(payload.currentPassword)) {
      throw new UnauthorizedException('Old password not match');
    }

    if (!payload.hashPassword) delete user.hashPassword;
    const newUser = Object.assign(new User(), { ...user, ...payload });
    if (isAdmin) {
      newUser.isAdmin = true;
    }

    return await this.userRepo.save(newUser);
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOneBy({ userId });
    return await this.userRepo.remove(user);
  }
}
