import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderItem } from "./order.item.entity";

@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => OrderItem, (o) => o.order)
  orderItems: OrderItem[];

  get getname(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  get total(): number {
    console.log(this);
    return this.orderItems.reduce(
      (pre, cur) => pre + cur.price * cur.quantity,
      0
    );
  }
}
