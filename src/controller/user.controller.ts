import bcrtpy from "bcrypt";
import { CreateUserValidation } from "./../validation/createUser.validation";
import { User } from "./../entity/user.entity";
import { Response } from "express";
import { Request } from "express";
import { getConnection, getManager, getRepository } from "typeorm";

export const allUser = async (req: Request, res: Response) => {
  const users = await getRepository(User)
    .createQueryBuilder("user")
    .select("user.password")
    .getMany();

  res.json(users);
};

export const CreateUser = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = CreateUserValidation.validate(body);

  if (error) {
    return res.status(400).json(error.details);
  }

  const repository = getManager().getRepository(User);

  const password = await bcrtpy.hash("1234", 10);
  const { passowrd, ...rest } = await repository.save({
    ...body,
    password,
  });

  res.status(201).json(rest);
};

export const GetUser = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);
  const { password, ...rest } = await repository.findOne(req.params.id);

  return res.json(rest);
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
    .select(["user.firstName", "user.lastName", "user.id", "user.email"])
    .from(User, "user")
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
