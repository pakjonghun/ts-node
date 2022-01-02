import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "./controller/order.controller";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "./controller/product.controller";
import { permissions } from "./controller/permission.controller";
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
import {
  createRole,
  deleteRole,
  getRole,
  roles,
  updateRole,
} from "./controller/role.controller";
import { upload } from "./controller/image.controller";

const routes = (router: Router) => {
  router.post("/api/register", register);
  router.post("/api/login", login);
  router.get("/api/user", tokenMiddleWare, user);
  router.get("/api/logout", tokenMiddleWare, logout);

  router.put("/api/users/info", tokenMiddleWare, updateInfo);
  router.put("/api/users/password", tokenMiddleWare, updatePassword);
  router.get("/api/users", allUser);
  router.post("/api/users", CreateUser);
  router.get("/api/users/:id", tokenMiddleWare, GetUser);
  router.put("/api/users/:id", tokenMiddleWare, UpdateUser);
  router.delete("/api/users/:id", tokenMiddleWare, DeleteUser);

  router.get("/api/permissions", tokenMiddleWare, permissions);
  router.get("/api/roles", tokenMiddleWare, roles);
  router.post("/api/roles", tokenMiddleWare, createRole);
  router.get("/api/roles/:id", tokenMiddleWare, getRole);
  router.put("/api/roles/:id", tokenMiddleWare, updateRole);
  router.delete("/api/roles/:id", tokenMiddleWare, deleteRole);

  router.post("/api/products", tokenMiddleWare, createProduct);
  router.get("/api/products", getAllProducts);
  router.get("/api/products/:id", getProduct);
  router.put("/api/products/:id", tokenMiddleWare, updateProduct);
  router.delete("/api/products/:id", tokenMiddleWare, deleteProduct);

  router.post("/api/uploads", upload);

  router.get("/api/orders", getAllOrders);
  router.get("/api/orders/:id", tokenMiddleWare, getOrder);
  router.post("/api/orders", tokenMiddleWare, createOrder);
  router.put("/api/orders/:id", updateOrder);
  router.delete("/api/orders/:id", deleteOrder);
};

export default routes;
