import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

// Composite Index
@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column()
  type: string;

  @Column('json')
  payload: Record<string, any>
}