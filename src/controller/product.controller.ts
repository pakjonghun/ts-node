import { Product } from "./../entity/product.entity";
import { getConnection, getManager } from "typeorm";
import { Response } from "express";
import { Request } from "express";
export const createProduct = async (req: Request, res: Response) => {
  const body = req.body;

  const productRepository = getManager().getRepository(Product);
  const product = await productRepository.save(body);

  res.status(201).json(product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const take = 15;
  const page = parseInt((req.query.page as string) || "1");

  const productRepository = getManager().getRepository(Product);
  const [data, total] = await productRepository.findAndCount({
    take,
    skip: (page - 1) * take,
  });
  res.json({ data, meta: { total, page, lastPage: Math.ceil(total / take) } });
};

export const getProduct = async (req: Request, res: Response) => {
  const productRepository = getManager().getRepository(Product);
  res.json(await productRepository.findOne(req.params.id));
};

export const updateProduct = async (req: Request, res: Response) => {
  const productRepository = getManager().getRepository(Product);
  await productRepository.save({
    id: Number(req.params.id),
    ...req.body,
  });

  res.status(202).json(await productRepository.findOne(req.params.id));
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productRepository = getManager().getRepository(Product);
  await productRepository.delete(req.params.id);

  res.sendStatus(204);
};
