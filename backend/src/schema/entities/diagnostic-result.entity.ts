import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Model } from './model.entity';
import { Record } from './record.entity';
import { Score } from './score.entity';

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

  @ApiProperty({ type: [Score] })
  @JoinColumn()
  @OneToMany(() => Score, (score) => score.result)
  scores: Score[];

  @ApiProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
