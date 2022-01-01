import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
}
