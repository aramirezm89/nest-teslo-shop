import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as IsvalidUUID } from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly prodcutImageRepository: Repository<ProductImage>,
    private readonly DataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productData } = createProductDto;

      const product = this.productRepository.create({
        ...productData,
        images: images.map((image) =>
          this.prodcutImageRepository.create({ url: image }),
        ),
      });
      const productSaved = await this.productRepository.save(product);

      return {
        ...productSaved,
        images: productSaved.images?.map((image) => image.url),
      };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return products.map((product) => ({
      ...product,
      images: product.images?.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product | null;
    if (IsvalidUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });
    }
    if (!product) {
      throw new BadRequestException(`Producto con ${term} no encontrado`);
    }

    const productWithImages = {
      ...product,
      images: product.images?.map((image) => image.url),
    };
    return productWithImages;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    // Busca el producto por ID y actualiza los campos enviados en el updateProductDto
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) {
      throw new BadRequestException(`Producto con ${id} no encontrado`);
    }

    //create query runner
    const queryRunner = this.DataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        // Elimina las imágenes antiguas
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        // Crea las nuevas imágenes
        const newImages = images.map((image) =>
          this.prodcutImageRepository.create({ url: image }),
        );
        product.images = newImages;
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException(`Producto con ${id} no encontrado`);
    }
    await this.productRepository.remove(product);
  }

  async deleteAllProducts() {
    try {
      await this.productRepository.deleteAll();
      this.logger.log('Todos los productos han sido eliminados');
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Error al eliminar todos los productos');
    }
  }

  private handleDbException(error: any) {
    this.logger.error(error);
    // Manejo específico para errores de constraint de unicidad
    if (error.code === '23505') {
      throw new BadRequestException(`Producto con ${error.detail}`);
    }

    // Otros errores de base de datos
    throw new BadRequestException('Error al crear el producto');
  }
}
