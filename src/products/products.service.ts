import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
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

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
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
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      // Busca el producto por ID y actualiza los campos enviados en el updateProductDto
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
        images: [],
      });

      if (!product) {
        throw new BadRequestException(`Producto con ${id} no encontrado`);
      }
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
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
