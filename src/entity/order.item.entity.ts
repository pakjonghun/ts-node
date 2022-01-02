import { ProductOrder } from "./order.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductOrder, (p) => p.orderItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: ProductOrder;
}
