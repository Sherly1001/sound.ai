import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn('uuid')
  recordId: string;

  @JoinColumn()
  @ManyToOne(() => Device)
  device: Device;

  @Column()
  timestamp: Date;

  @Column('float')
  temperature: number;

  @Column('float')
  humidity: string;

  @Column()
  audioFilePath: string;

  @Column()
  audioFft: string;

  @Column()
  imageFilePath: string;

  @Column()
  location: string;
}
