import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ type: () => DiagnosticResult })
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  @ManyToOne(() => DiagnosticResult, (result) => result.scores, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  result: DiagnosticResult;

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  @ManyToOne(() => Label, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  label: Label;

  @ApiProperty()
  @Column('float')
  score: number;
}
