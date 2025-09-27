import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage, Product } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  // Registra la entidad Product para que se pueda inyectar su repositorio en el módulo
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
})
export class ProductsModule {}
