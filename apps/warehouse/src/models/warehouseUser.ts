import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Warehouse } from './warehouse';

@Entity({ name: 'warehouse_users' })
export class WarehouseUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  warehouse: Warehouse;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'role' })
  role: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;
}
