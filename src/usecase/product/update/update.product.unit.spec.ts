import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("123", "productName", 1);

const input = {
  id: "123",
  name: "productNameUpdated",
  price: 2,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
    findAll: jest.fn(),
  };
};

describe("Unit test for customer update use case", () => {
  it("Should update a product", async () => {
    const productRepository = MockRepository();
    const prodcutUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await prodcutUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
