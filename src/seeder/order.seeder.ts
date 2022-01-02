import { Response } from "express";
import { Request } from "express";
import { ProductOrder } from "./../entity/order.entity";
import faker from "faker";
import { OrderItem } from "./../entity/order.item.entity";
import { getManager } from "typeorm";
import { createConnection } from "typeorm";
import { randomInt } from "crypto";

createConnection().then(async (connection) => {
  const orderItemRepository = getManager().getRepository(OrderItem);
  const orderRepository = getManager().getRepository(ProductOrder);

  for (let i = 0; i < 30; i++) {
    const order = await orderRepository.save({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      createdAt: faker.date.past(2).toDateString(),
    });

    for (let i = 0; i < 5; i++) {
      const item = await orderItemRepository.save({
        title: faker.lorem.words(2),
        price: randomInt(2, 1000),
        quantity: randomInt(2, 20),
        order,
      });
    }
  }

  process.exit(0);
});
