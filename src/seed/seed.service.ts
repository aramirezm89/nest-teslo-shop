import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/product.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(private readonly productService: ProductsService) {}
  async runSeed() {
    const productsCount = await this.fillProducts();
    return `Seed ejecutado. Productos insertados: ${productsCount}`;
  }

  private async fillProducts() {
    await this.productService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = products.map((p) => {
      const product = this.productService.create(p);
      return product;
    });

    await Promise.all(insertPromises);

    this.logger.log(`Se insertaron ${insertPromises.length} productos`);
    return insertPromises.length;
  }
}
