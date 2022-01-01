require("dotenv").config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";

createConnection().then((connection) => {
  const app = express();
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    })
  );

  routes(app);
  const port = process.env.PORT;
  app.listen(port, () => console.log(`server is running on port ${port}`));
});
