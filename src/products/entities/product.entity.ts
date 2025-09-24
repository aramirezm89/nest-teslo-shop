import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  slug: string;

  @Column('numeric')
  price: number;

  @Column('numeric')
  stock: number;

  @Column('text')
  brand: string;
}
