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
import { Model } from './model.entity';
import { Record } from './record.entity';
import { Score } from './score.entity';
import { User } from './user.entity';

@Entity()
export class DiagnosticResult {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  resultId: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Record)
  record: Record;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Model)
  model: Model;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  diagnosticByUser: User;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => Device, { nullable: true })
  diagnosticByDevice: Device;

  @ApiProperty({ type: [Score] })
  @JoinColumn()
  @OneToMany(() => Score, (score) => score.result)
  scores: Score[];

  @ApiProperty()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
