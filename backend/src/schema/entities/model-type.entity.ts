import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ModelType {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  typeId: string;

  @ApiProperty()
  @Column()
  typeName: string;
}
