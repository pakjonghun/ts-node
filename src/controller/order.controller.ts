import { ProductOrder } from "./../entity/order.entity";
import { OrderItem } from "./../entity/order.item.entity";
import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import { Parser } from "json2csv";

export const getAllOrders = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const take = 15;
  const page = parseInt(req.query.page as string | "1");
  // const temp = await getConnection()
  //   .createQueryBuilder()
  //   .select([
  //     "order.id",
  //     "order.email",
  //     'JSON_ARRAYAGG(JSON_OBJECT("title",oi.title,"quantity",oi.quantity,"price",oi.price)) as items',
  //   ])
  //   .from(ProductOrder, "order")
  //   .leftJoin(OrderItem, "oi", "oi.order=order.id")
  //   .where("order.email=:email", { email: user.email })
  //   .groupBy("order.id")
  //   .orderBy("order.createdAt", "DESC");

  // const total = await temp.getCount();
  // const orders = await temp
  //   .take(take)
  //   .skip((page - 1) * take)
  //   .execute();

  // for (let item of orders) {
  //   item.items = JSON.parse(item.items);
  // }

  const a = getManager().getRepository(ProductOrder);
  const [o, c] = await a.findAndCount({
    take,
    skip: (page - 1) * take,
    relations: ["orderItems"],
  });
  const k = o.map((item) => ({
    name: item.getname,
    total: item.total,
    email: item.email,
    createdAt: item.createdAt,
    items: item.orderItems,
  }));

  res.json({
    data: k,
    meta: { page, total: c, lastPage: Math.ceil(c / take) },
  });
};

export const createOrder = async (req: Request, res: Response) => {
  const { order, products } = req.body;

  const orderRepo = getManager().getRepository(ProductOrder);
  const userOrder = await orderRepo.save({
    ...order,
  });

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(OrderItem)
    .values(products.map((item) => ({ ...item, order: userOrder })))
    .execute();

  res.status(201).json({ message: "success" });
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await getConnection()
    .createQueryBuilder()
    .select([
      "po.email email",
      'JSON_ARRAYAGG(JSON_OBJECT("title",oi.title,"price",oi.price,"quantity",oi.quantity)) products',
    ])
    .from(ProductOrder, "po")
    .leftJoin(OrderItem, "oi", "oi.order=po.id")
    .where("po.id=:id", { id: req.params.id })
    .groupBy("po.id")
    .orderBy("po.id", "ASC")
    .execute();

  order[0].products = JSON.parse(order[0].products);
  res.json(...order);
};

export const updateOrder = async (req: Request, res: Response) => {};

export const deleteOrder = async (req: Request, res: Response) => {
  const orderRepo = getManager().getRepository(ProductOrder);
  await orderRepo.delete(req.params.id);

  res.sendStatus(204);
};

export const Export = async (req: Request, res: Response) => {
  const parser = new Parser({
    fields: ["ID", "Name", "Email", "CreatedAt", "Title", "Price", "Quantity"],
  });

  const repo = getManager().getRepository(ProductOrder);

  const orders = await repo.find({ relations: ["orderItems"] });

  const tempArr = [];
  orders.forEach((order) => {
    tempArr.push({
      ID: order.id,
      Name: order.getname,
      Email: order.email,
      CreatedAt: order.createdAt,
      Title: "",
      Price: "",
      Quantity: "",
    });

    order.orderItems.forEach((item) => {
      tempArr.push({
        ID: "",
        Name: "",
        Email: "",
        CreatedAt: "",
        Title: item.title,
        Price: item.price,
        Quantity: item.quantity,
      });
    });
  });
  const csv = parser.parse(tempArr);

  res.header("Content-Type", "text/csv");
  res.attachment("orders.csv");
  res.send(csv);
};

export const getChart = async (req: Request, res: Response) => {
  const manager = getManager();
  const result = await manager.query(
    `
    SELECT DATE_FORMAT(po.createdAt, '%Y-%m-%d') date,
           SUM(oi.price * oi.quantity) sum
    FROM product_order po
    JOIN order_item oi
    ON po.id = oi.order_id
    GROUP BY date;
    `
  );
  res.json(result);
};
