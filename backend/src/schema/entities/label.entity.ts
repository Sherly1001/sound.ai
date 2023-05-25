import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Label {
  @PrimaryGeneratedColumn('uuid')
  labelId: string;

  @Column()
  labelName: string;
}
