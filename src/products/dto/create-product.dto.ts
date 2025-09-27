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

export class CreateProductDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  title: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsArray()
  @Transform(({ value }) => value?.map((size: string) => size.toUpperCase()))
  @IsIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'], { each: true })
  sizes: ProductSize[];

  @Transform(({ value }) => value.toLowerCase())
  @IsIn(['male', 'female', 'unisex', 'kid'])
  gender: Gender;

  @IsArray()
  @Transform(({ value }) => value?.map((tag: string) => tag.toLowerCase()))
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
