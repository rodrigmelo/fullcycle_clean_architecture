import CreateProductUseCase from "./create.product.usecase";

const defaultProductName = "productName";

const input = {
  name: defaultProductName,
  price: 1,
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("Should thrown error when name is empty", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    input.name = "";

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("Should thrown error when price is less than zero", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    input.name = defaultProductName;
    input.price = -1;

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
