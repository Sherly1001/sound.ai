import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  toJSON() {
    return instanceToPlain(this);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  hashPassword: string;

  @ApiProperty()
  @Column({ default: false })
  isAdmin: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  private encryptPassword() {
    this.hashPassword = bcrypt.hashSync(
      this.hashPassword,
      bcrypt.genSaltSync(),
    );
  }

  public checkPassword(password: string) {
    return bcrypt.compareSync(password, this.hashPassword);
  }
}