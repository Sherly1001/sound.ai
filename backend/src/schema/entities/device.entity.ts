import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  deviceId: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Model, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  currentModel: Model;

  @ApiProperty()
  @Column({ unique: true })
  deviceName: string;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Exclude()
  @Column()
  hashPassword: string;

  @BeforeInsert()
  @BeforeUpdate()
  private encryptPassword() {
    if (this.hashPassword) {
      this.hashPassword = bcrypt.hashSync(
        this.hashPassword,
        bcrypt.genSaltSync(),
      );
    }
  }

  public checkPassword(password: string) {
    return bcrypt.compareSync(password, this.hashPassword);
  }
}
