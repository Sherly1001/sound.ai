import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from './device.entity';
import { DiagnosticResult } from './diagnostic-result.entity';

@Entity()
export class Record {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  recordId: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Device, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  device: Device;

  @ApiProperty({ type: () => [DiagnosticResult] })
  @JoinColumn()
  @OneToMany(() => DiagnosticResult, (result) => result.record)
  results: DiagnosticResult[];

  @ApiProperty()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
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
