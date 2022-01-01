import { Permission } from "./permission.entity";
import { User } from "./user.entity";
import {
  Column,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Entity } from "typeorm";
import { RolePermission } from "./rolePermissionEntity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.roleId)
  user: User[];

  @OneToMany(() => RolePermission, (rp) => rp.role)
  permission: RolePermission[];
}
