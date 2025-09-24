import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  // Indica que se va a usar la entidad Product esencial para la creacion de tablas
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
