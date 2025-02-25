import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ name: 'is_active' })
  is_active: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;
}
