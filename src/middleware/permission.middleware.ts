import { Response } from "express";
import { Request } from "express";
export const permissionMiddleware = (access: string) => {
  return (req: Request, res: Response, next: Function) => {
    console.log(access);
    const user = res.locals.user;
    const per = user.roleId.permission;
    console.log(per);
    if (req.method === "GET") {
      if (
        !per.some(
          (p) => p.name === `view${access}` || p.name === `edit${access}`
        )
      ) {
        return res.sendStatus(401).json({ message: "unauthorized" });
      }
    } else {
      if (!per.some((p) => p.name === `edit${access}`)) {
        return res.sendStatus(401).json({ message: "unauthorized" });
      }
    }

    next();
  };
};
