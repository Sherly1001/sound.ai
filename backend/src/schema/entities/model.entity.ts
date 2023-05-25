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
  @PrimaryGeneratedColumn('uuid')
  modelId: string;

  @JoinColumn()
  @ManyToOne(() => ModelType)
  type: ModelType;

  @Column()
  modelName: string;

  @Column()
  modelFilePath: string;

  @Column()
  timestamp: Date;
}
