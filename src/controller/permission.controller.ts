import { Permission } from "./../entity/permission.entity";
import { getManager } from "typeorm";
import { Response } from "express";
import { Request } from "express";

export const permissions = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(Permission);
  const take = 15;
  const page = parseInt((req.query.page as string) || "1");

  const [data, total] = await repository.findAndCount({
    take,
    skip: (page - 1) * take,
  });
  res.json({ data, meta: { page, total, lastpage: Math.ceil(total / take) } });
};
