import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { Gender, ProductSize } from '../interfaces';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('numeric', { default: 0 })
  price: number;

  @Column('numeric', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: ProductSize[];

  @Column('text')
  gender: Gender;
}
