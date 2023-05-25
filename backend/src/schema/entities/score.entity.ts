import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiagnosticResult } from './diagnostic-result.entity';
import { Label } from './label.entity';

@Entity()
export class Score {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  @ManyToOne(() => DiagnosticResult, (result) => result.scores)
  result: DiagnosticResult;

  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  @ManyToOne(() => Label)
  label: Label;

  @Column('float')
  score: number;
}
