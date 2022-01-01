import { Permission } from "./../entity/permission.entity";
import { getManager } from "typeorm";
import { Response } from "express";
import { Request } from "express";

export const permissions = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(Permission);
  res.json(await repository.find());
};
