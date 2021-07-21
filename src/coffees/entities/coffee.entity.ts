import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavour } from "./flavour.entity";

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({default: 0})
  recommendations: number;

  @JoinTable()
  @ManyToMany(
    type => Flavour,
    flavor => flavor.coffees,
    { cascade: true }
  )
  flavors: Flavour[];
}