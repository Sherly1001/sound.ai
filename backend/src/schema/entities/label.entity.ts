import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Label {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  labelId: string;

  @ApiProperty()
  @Column({ unique: true })
  labelName: string;
}
