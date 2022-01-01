import { Role } from "./role.entity";
import { Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.permission)
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.role)
  permission: Permission;
}
