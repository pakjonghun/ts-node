import { permissions } from "./permission.controller";
import { Role } from "./../entity/role.entity";
import { getManager } from "typeorm";
import { Request, Response } from "express";
import { Permission } from "../entity/permission.entity";

export const roles = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(Role);

  res.json(await repository.find());
};

export const createRole = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;

  const roleRepository = getManager().getRepository(Role);

  const role = await roleRepository.save({
    name,
    permissions: permissions.map((id) => ({ id })),
  });

  res.json(role);
};

export const getRole = async (req: Request, res: Response) => {};
