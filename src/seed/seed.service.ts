import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/product.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    const productsCount = await this.fillProductsAndUsers();
    return {
      message: 'Seed ejecutado',
      productsCreated: productsCount,
    };
  }

  private async fillProductsAndUsers() {
    await this.productService.deleteAllProducts();
    this.logger.log('Productos eliminados');
    await this.userRepository.deleteAll();
    this.logger.log('Usuarios eliminados');

    const users = initialData.users;
    const insertPromisesUsers = users.map((u) => {
      const user = this.userRepository.create(u);
      return this.userRepository.save(user);
    });
    const [userInserted] = await Promise.all(insertPromisesUsers);
    console.log(userInserted);
    this.logger.log(`Se insertaron ${insertPromisesUsers.length} usuarios`);

    const products = initialData.products;
    const insertPromises = products.map((p) => {
      const product = this.productService.create(p, userInserted);
      return product;
    });

    await Promise.all(insertPromises);

    this.logger.log(`Se insertaron ${insertPromises.length} productos`);
    return insertPromises.length;
  }
}
