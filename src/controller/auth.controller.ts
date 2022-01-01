import { LoginValidation } from "./../validation/login.validation";
import { User } from "./../entity/user.entity";
import { Request, Response } from "express";
import { registerValidation } from "../validation/register.validation";
import { getConnection, getManager } from "typeorm";
import bcrtpy from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { updatePasswordValidation } from "../validation/updatePassword.validation";

export const register = async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  const { error } = registerValidation.validate(body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  if (body.password !== body.passwordConfirm) {
    res.status(400).json({ message: "password not match" });
    return;
  }

  const hashedPassword = await bcrtpy.hash(body.password, 10);

  const repository = getManager().getRepository(User);

  const { password, ...rest } = await repository.save({
    firstName: body.firstName,
    lastName: body.lastName,
    password: hashedPassword,
    email: body.email,
  });

  res.send(rest);
};

export const login = async (req: Request, res: Response) => {
  const body = req.body;
  const { error } = LoginValidation.validate(body);

  if (error) {
    res.status(400).json(error.details);
    return;
  }

  const firstUser = await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.email = :email", { email: body.email })
    .getOne();

  if (!firstUser) {
    res.status(404).json({ message: "unauthorized" });
    return;
  }

  if (!(await bcrtpy.compare(body.password, firstUser.password))) {
    res.status(400).json({ message: "unauthorized" });
    return;
  }

  const token = sign({ id: firstUser.id }, process.env.TOKEN_SECRET);
  res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

  res.json({ message: "success" });
};

export const user = async (req: Request, res: Response) => {
  const { password, ...rest } = res.locals.user;

  res.json(rest);
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.json({ message: "success" });
};

export const updateInfo = async (req: Request, res: Response) => {
  const body = req.body;
  const user = res.locals.user;

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ ...body })
    .where({ id: user.id })
    .execute();
  const { password, ...rest } = await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .getOne();

  res.json(rest);
};

export const updatePassword = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const body = req.body;

  const { error } = updatePasswordValidation.validate(body);

  if (error) {
    return res.status(400).json(error.details);
  }

  if (body.password !== body.passwordConfirm) {
    return res.status(400).json({ message: "not match password" });
  }

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .where({ id: user.id })
    .set({ password: await bcrtpy.hash(body.password, 10) })
    .execute();

  const { password, ...rest } = await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where({ id: user.id })
    .getOne();

  res.json(rest);
};
