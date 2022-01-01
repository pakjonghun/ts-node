import { permissions } from "./../controller/permission.controller";
import { RolePermission } from "./../entity/rolePermissionEntity";
import { Role } from "./../entity/role.entity";
import { Permission } from "./../entity/permission.entity";
import { getConnection, getManager } from "typeorm";
import { createConnection } from "typeorm";
import { User } from "../entity/user.entity";

createConnection().then(async (connection) => {
  const permissionRepository = getManager().getRepository(Permission);
  const permissions = {
    viewUser: "",
    editUser: "",
    viewRoles: "",
    editRoles: "",
    viewProducts: "",
    editProducts: "",
    viewOrders: "",
    editOrders: "",
  };

  for (let name in permissions) {
    const item = await permissionRepository.save({
      name,
    });
    permissions[name] = item;
  }

  const roleRepository = getManager().getRepository(Role);
  const roles = ["admin", "editor", "viewer"];

  const admin = await roleRepository.save({
    name: "admin",
  });

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(RolePermission)
    .values(
      Object.keys(permissions).map((key) => ({
        role: admin,
        permission: permissions[key],
      }))
    )
    .execute();

  const editor = await roleRepository.save({
    name: "editor",
  });

  delete permissions["editRoles"];

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(RolePermission)
    .values(
      Object.keys(permissions).map((key) => ({
        role: editor,
        permission: permissions[key],
      }))
    )
    .execute();

  delete permissions["editProducts"];
  delete permissions["editOrders"];
  delete permissions["editUser"];

  const viewer = await roleRepository.save({
    name: "viewer",
  });

  delete permissions["editRoles"];

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(RolePermission)
    .values(
      Object.keys(permissions).map((key) => ({
        role: viewer,
        permission: permissions[key],
      }))
    )
    .execute();
});
