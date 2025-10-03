import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../interfaces';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column('text', { select: false })
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

  @BeforeInsert()
  checkFields() {
    this.email = this.email.toLowerCase();
    this.fullname = this.fullname.toLowerCase();
  }

  @BeforeUpdate()
  checkFieldsUpdate() {
    this.checkFields();
  }
}
