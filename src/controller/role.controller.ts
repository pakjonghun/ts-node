import { Permission } from "./../entity/permission.entity";
import { permissions } from "./permission.controller";
import { RolePermission } from "./../entity/rolePermissionEntity";
import { Role } from "./../entity/role.entity";
import { getConnection, getManager, Raw } from "typeorm";
import { Request, Response } from "express";

export const roles = async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const take = 15;
  const repository = getManager().getRepository(Role);
  const [data, total] = await repository.findAndCount({
    take,
    skip: (page - 1) * take,
  });
  res.json({ data, meta: { total, lastpage: Math.ceil(total / take), page } });
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

  res.send(...r);
};

export const updateRole = async (req: Request, res: Response) => {
  const { name, permissionIds } = req.body;

  await getConnection()
    .createQueryBuilder()
    .update(Role)
    .set({ name })
    .where("role.id=:id", { id: req.params.id })
    .execute();

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(RolePermission)
    .where("role = :id", { id: req.params.id })
    .execute();

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(RolePermission)
    .values(
      permissionIds.map((id) => ({
        role: { id: Number(req.params.id) },
        permission: { id },
      }))
    )
    .execute();

  const newRole = await getConnection()
    .createQueryBuilder()
    .select([
      "role.id",
      "role.name",
      "JSON_ARRAYAGG(permission.name) as permissions",
    ])
    .from(Role, "role")
    .leftJoin(RolePermission, "rp", "rp.roleId = role.id")
    .leftJoin(Permission, "permission", "permission.id = rp.permissionId")
    .where("role.id = :id", { id: req.params.id })
    .groupBy("role.id")
    .execute();

  newRole[0].permissions = JSON.parse(newRole[0].permissions);

  res.status(202).json(...newRole);
};

export const deleteRole = async (req: Request, res: Response) => {
  const roleRepository = getManager().getRepository(Role);
  const rpRepository = getManager().getRepository(RolePermission);

  roleRepository.delete(req.params.id);
  rpRepository.delete({
    role: {
      id: Number(req.params.id),
    },
  });

  res.sendStatus(204);
};
