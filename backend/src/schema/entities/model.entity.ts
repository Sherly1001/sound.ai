import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModelType } from './model-type.entity';

@Entity()
export class Model {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  modelId: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => ModelType)
  type: ModelType;

  @ApiProperty()
  @Column()
  modelName: string;

  @ApiProperty()
  @Column()
  modelFilePath: string;

  @ApiProperty()
  @Column()
  timestamp: Date;
}
