import { Product } from "../entity/product.entity";
import { createConnection, getManager } from "typeorm";
import faker from "faker";
import { randomInt } from "crypto";

createConnection().then(async (connection) => {
  const productRepository = getManager().getRepository(Product);
  for (let i = 0; i < 30; i++) {
    await productRepository.save({
      title: faker.lorem.words(2),
      description: faker.lorem.words(20),
      price: randomInt(10, 1000),
      image: faker.image.imageUrl(200, 200, "", true),
    });
  }
  process.exit(0);
});
