import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  deviceId: string;

  @JoinColumn()
  @ManyToOne(() => Model)
  currentModel: Model;

  @Column()
  deviceName: string;

  @Column()
  hashPassword: string;
}
