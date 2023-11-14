import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usercase";

const firstInput = {
  name: "firstProductName",
  price: 1,
};

const secondInput = {
  name: "secondProductName",
  price: 2,
};

describe("Test list product use case", () => {
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

  it("Should list products", async () => {
    const productRepository = new ProductRepository();
    const createUseCase = new CreateProductUseCase(productRepository);
    const firstCreateOutput = await createUseCase.execute(firstInput);
    const secondCreateOutput = await createUseCase.execute(secondInput);

    const listUseCase = new ListProductUseCase(productRepository);
    const listOutput = await listUseCase.execute({});

    expect(listOutput.products.length).toBe(2);

    expect(listOutput.products[0].id).toBe(firstCreateOutput.id);
    expect(listOutput.products[0].name).toBe(firstInput.name);
    expect(listOutput.products[0].price).toBe(firstInput.price);

    expect(listOutput.products[1].id).toBe(secondCreateOutput.id);
    expect(listOutput.products[1].name).toBe(secondInput.name);
    expect(listOutput.products[1].price).toBe(secondInput.price);
  });
});
