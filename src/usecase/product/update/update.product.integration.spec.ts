import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "../find/find.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

const input = {
  name: "productName",
  price: 1,
};

describe("Test update product use case", () => {
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

  it("Should update a product", async () => {
    const productRepository = new ProductRepository();
    const createUseCase = new CreateProductUseCase(productRepository);
    const updateUseCase = new UpdateProductUseCase(productRepository);
    const findUseCase = new FindProductUseCase(productRepository);
    const createOutput = await createUseCase.execute(input);

    const findInput = {
      id: createOutput.id,
    };

    const findOutput = await findUseCase.execute(findInput);

    const updateInput = {
      id: findOutput.id,
      name: "updatedName",
      price: 2,
    };

    const updateOutput = await updateUseCase.execute(updateInput);

    expect(updateOutput).toEqual({
      id: findOutput.id,
      name: "updatedName",
      price: 2,
    });
  });
});
