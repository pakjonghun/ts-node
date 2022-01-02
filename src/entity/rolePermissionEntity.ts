import { Role } from "./role.entity";
import { Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.permission, { onDelete: "CASCADE" })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.role, {
    onDelete: "CASCADE",
  })
  permission: Permission;
}
