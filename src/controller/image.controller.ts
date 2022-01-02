import multer from "multer";
import { NextFunction, Response } from "express";
import { Request } from "express";
import { extname } from "path/posix";
export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
      const randomName = Math.random().toString(20).substring(2, 12);
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  });

  const upload = multer({ storage }).single("image");
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json(err);
    }

    res.send({
      url: `http://localhost:8000/api/uploads/${req.file.filename}`,
    });
  });
};
