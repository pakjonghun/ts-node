import { Permission } from "./../entity/permission.entity";
import { permissions } from "./permission.controller";
import { RolePermission } from "./../entity/rolePermissionEntity";
import { Role } from "./../entity/role.entity";
import { getConnection, getManager, Raw } from "typeorm";
import { Request, Response } from "express";

export const roles = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(Role);

  res.json(await repository.find());
};

export const createRole = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;
  const roleRepository = getManager().getRepository(Role);
  const perRepository = getManager().getRepository(Permission);

  const role = await roleRepository.save({
    name,
  });

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(RolePermission)
    .values(
      permissions.map((id) => ({
        role,
        permission: { id },
      }))
    )
    .execute();

  res.json(role);
};

export const getRole = async (req: Request, res: Response) => {
  const r = await getConnection()
    .createQueryBuilder()
    .select([
      "role.id",
      "role.name",
      "JSON_ARRAYAGG(permission.name) as permissions",
    ])
    .from(Role, "role")
    .leftJoin(RolePermission, "rp", "rp.role=role.id")
    .leftJoin(Permission, "permission", "rp.permission=permission.id")
    .where("role.id=:id", { id: req.params.id })
    .groupBy("role.id")
    .execute();

  for (let item of r) {
    item.permissions = JSON.parse(item.permissions);
  }

  res.send(r);
};

export const updateRole = async (req: Request, res: Response) => {
  const { name, permissionIds } = req.body;

  // await getConnection()
  //   .createQueryBuilder()
  //   .update(Role)
  //   .set({ name })
  //   .where("role.id=:id", { id: req.params.id })
  //   .execute();

  // await getConnection()
  //   .createQueryBuilder()
  //   .delete()
  //   .from(RolePermission)
  //   .where("role = :id", { id: req.params.id })
  //   .execute();

  // await getConnection()
  //   .createQueryBuilder()
  //   .insert()
  //   .into(RolePermission)
  //   .values(
  //     permissionIds.map((id) => ({
  //       role: { id: Number(req.params.id) },
  //       permission: { id },
  //     }))
  //   )
  //   .execute();

  const repo = getManager().getRepository(Role);

  await repo.save({
    id: Number(req.params.id),
    name,
  });
};
