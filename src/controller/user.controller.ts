import { Role } from "./../entity/role.entity";
import bcrtpy from "bcrypt";
import { CreateUserValidation } from "./../validation/createUser.validation";
import { User } from "./../entity/user.entity";
import { Response } from "express";
import { Request } from "express";
import { getConnection, getManager, getRepository } from "typeorm";

export const allUser = async (req: Request, res: Response) => {
  const users = await getRepository(User)
    .createQueryBuilder("user")
    .select(["user.email", "user.firstname", "user.lastname", "role.name"])
    .leftJoin(Role, "role", "user.role_id = role.id")
    .where("role.id not in (1)")
    .execute();
  res.json(users);
};

export const CreateUser = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = CreateUserValidation.validate(body);

  if (error) {
    return res.status(400).json(error.details);
  }

  const hashedPassword = await bcrtpy.hash("1234", 10);
  const repository = getManager().getRepository(User);
  const { password, ...rest } = await repository.save({
    ...body,
    password: hashedPassword,
  });

  res.status(201).json(rest);
};

export const GetUser = async (req: Request, res: Response) => {
  const user = await getConnection()
    .createQueryBuilder()
    .select(["user.firstname", "user.lastname", "user.email", "role.name"])
    .from(User, "user")
    .leftJoin(Role, "role", "role.id = user.role")
    .where("user.id = :id", { id: req.params.id })
    .execute();

  return res.json(user);
};

export const UpdateUser = async (req: Request, res: Response) => {
  const { roleId, ...body } = req.body;

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .where({ id: req.params.id })
    .set({ ...body })
    .execute();

  const user = await getConnection()
    .createQueryBuilder()
    .select([
      "user.firstname",
      "user.lastname",
      "user.id",
      "user.email",
      "role.name",
    ])
    .from(User, "user")
    .leftJoin(Role, "role", "role.id = user.role_id")
    .where("id = :id", { id: req.params.id })
    .getOne();

  return res.json(user);
};

export const DeleteUser = async (req: Request, res: Response) => {
  const a = await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: req.params.id })
    .execute();

  res.status(204).send(null);
};
