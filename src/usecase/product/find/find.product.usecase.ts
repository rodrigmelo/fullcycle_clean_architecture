import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputFindCustomerDto,
  OutputFindCustomerDto,
} from "../../customer/find/find.customer.dto";

export default class FindProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
    const output = await this.productRepository.find(input.id);

    return {
      id: output.id,
      name: output.name,
      price: output.price,
    };
  }
}
