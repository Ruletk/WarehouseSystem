import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WarehouseTag } from './warehouseTag';
import { WarehouseUser } from './warehouseUser';

@Entity({ name: 'warehouses' })
export class Warehouse {
  @PrimaryGeneratedColumn({ name: 'warehouse_id' })
  id: number;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'latitude', nullable: true })
  latitude: number;

  @Column({ name: 'longitude', nullable: true })
  longitude: number;

  @Column({ name: 'address', nullable: true })
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;

  @OneToMany(() => WarehouseTag, (tag) => tag.warehouse)
  tags: WarehouseTag[];

  @OneToMany(() => WarehouseUser, (user) => user.warehouse)
  users: WarehouseUser[];
}
