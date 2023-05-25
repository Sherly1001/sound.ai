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
  @PrimaryGeneratedColumn('uuid')
  resultId: string;

  @JoinColumn()
  @ManyToOne(() => Record)
  record: Record;

  @JoinColumn()
  @ManyToOne(() => Model)
  model: Model;

  @JoinColumn()
  @OneToMany(() => Score, (score) => score.result)
  scores: Score[];

  @Column()
  timestamp: Date;
}
