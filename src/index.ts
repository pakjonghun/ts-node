import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
const port = process.env.PORT;
app.listen(port, () => console.log(`server is running on port ${port}`));
