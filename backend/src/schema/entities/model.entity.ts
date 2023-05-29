import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
  @Column({ unique: true })
  modelName: string;

  @Exclude()
  @Column()
  modelFilePath: string;

  @ApiProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
