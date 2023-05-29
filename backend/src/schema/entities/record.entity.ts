import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  recordId: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Device)
  device: Device;

  @ApiProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ApiProperty()
  @Column('float')
  temperature: number;

  @ApiProperty()
  @Column('float')
  humidity: number;

  @ApiProperty()
  @Column()
  audioFilePath: string;

  @ApiProperty()
  @Column()
  audioFft: string;

  @ApiProperty()
  @Column()
  imageFilePath: string;

  @ApiProperty()
  @Column()
  location: string;
}
