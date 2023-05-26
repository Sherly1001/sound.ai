import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Device {
  toJSON() {
    return instanceToPlain(this);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  deviceId: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Model)
  currentModel: Model;

  @ApiProperty()
  @Column({ unique: true })
  deviceName: string;

  @Exclude()
  @Column()
  hashPassword: string;

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
