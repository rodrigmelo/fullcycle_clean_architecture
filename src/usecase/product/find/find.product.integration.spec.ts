import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "./find.product.usecase";

const input = {
  name: "productName",
  price: 1,
};

describe("Test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should find a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const createOutput = await createProductUseCase.execute(input);

    const inputFind = {
      id: createOutput.id,
    };

    const findProductUseCase = new FindProductUseCase(productRepository);

    const findOutput = await findProductUseCase.execute(inputFind);

    expect(findOutput).toEqual({
      id: createOutput.id,
      name: input.name,
      price: input.price,
    });
  });
});
