import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import type { Gender } from '../interfaces';
import { ProductSize } from '../interfaces';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique),',
    nullable: false,
    example: 'Product title',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Product description',
    nullable: true,
    example: 'Product description',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product slug (unique)',
    nullable: true,
    example: 'product-slug',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Product price',
    nullable: true,
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product stock',
    nullable: true,
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product sizes',
    nullable: true,
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  })
  @IsArray()
  @Transform(({ value }) => value?.map((size: string) => size.toUpperCase()))
  @IsIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], { each: true })
  sizes: ProductSize[];

  @ApiProperty({
    description: 'Product gender',
    nullable: true,
    example: 'men',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(['men', 'women', 'unisex', 'kid'])
  gender: Gender;

  @ApiProperty({
    description: 'Product tags',
    nullable: true,
    example: ['tag1', 'tag2', 'tag3'],
  })
  @IsArray()
  @Transform(({ value }) => value?.map((tag: string) => tag.toLowerCase()))
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Product images',
    nullable: true,
    example: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
