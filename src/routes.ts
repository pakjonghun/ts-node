import {
  allUser,
  CreateUser,
  DeleteUser,
  GetUser,
  UpdateUser,
} from "./controller/user.controller";
import { tokenMiddleWare } from "./middleware/auth.middleware";
import { Router } from "express";
import {
  login,
  logout,
  register,
  updateInfo,
  updatePassword,
  user,
} from "./controller/auth.controller";

const routes = (router: Router) => {
  router.post("/api/register", register);
  router.post("/api/login", login);
  router.get("/api/user", tokenMiddleWare, user);
  router.get("/api/logout", tokenMiddleWare, logout);
  router.put("/api/users/info", tokenMiddleWare, updateInfo);
  router.put("/api/users/password", tokenMiddleWare, updatePassword);
  router.get("/api/users", tokenMiddleWare, allUser);
  router.post("/api/users/create", tokenMiddleWare, CreateUser);
  router.get("/api/users/:id", tokenMiddleWare, GetUser);
  router.put("/api/users/:id", tokenMiddleWare, UpdateUser);
  router.delete("/api/users/:id", tokenMiddleWare, DeleteUser);
};

export default routes;