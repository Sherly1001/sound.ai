import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ModelType {
  @PrimaryGeneratedColumn('uuid')
  typeId: string;

  @Column()
  typeName: string;
}
