import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Gender, ProductSize } from '../interfaces';
import { ProductImage } from './product-images.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '12345678-1234-1234-1234-123456789012',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Product Title',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 'This is a product description',
    description: 'Product description',
    default: null,
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 'product-slug',
    description: 'Product slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
    default: 0,
  })
  @Column('numeric', { default: 0 })
  price: number;

  @ApiProperty({
    example: 0,
    description: 'Product stock',
    default: 0,
  })
  @Column('numeric', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    description: 'Product sizes',
    default: [],
  })
  @Column('text', { array: true })
  sizes: ProductSize[];

  @ApiProperty({
    example: 'men',
    description: 'Product gender',
    uniqueItems: true,
  })
  @Column('text')
  gender: Gender;

  @ApiProperty({
    example: ['tag1', 'tag2', 'tag3'],
    description: 'Product tags',
    default: [],
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: ['https://example.com/image.jpg', 'https://example.com/image.jpg'],
    type: [ProductImage],
    description: 'Product images',
    default: [],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty({ type: User, example: 'a58d7ffa-081e-4713-9a6a-189bd02d0908' })
  @ManyToOne(() => User, (user) => user.products, {
    cascade: true,
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replaceAll(/ /g, '_')
        .replaceAll("'", '');
    } else {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(/ /g, '_')
        .replaceAll("'", '');
    }
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(/ /g, '_')
      .replaceAll("'", '');
  }
}
