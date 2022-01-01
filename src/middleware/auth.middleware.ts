import { User } from "./../entity/user.entity";
import { getConnection, getManager } from "typeorm";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const tokenMiddleWare = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const cookie = req.cookies?.["jwt"];

    if (!cookie) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const payload = verify(cookie, process.env.TOKEN_SECRET);

    if (typeof payload !== "object" || !payload.id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const user = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .getOne();

    if (!user) {
      return res.status(404).json({ message: "no user" });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
