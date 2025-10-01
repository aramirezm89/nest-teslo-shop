import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../interfaces';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullname: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    default: [UserRole.USER],
    enum: UserRole,
    array: true,
  })
  roles: UserRole[];
}
