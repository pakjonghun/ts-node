import { RolePermission } from "./rolePermissionEntity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => RolePermission, (rp) => rp.role)
  role: RolePermission[];
}
