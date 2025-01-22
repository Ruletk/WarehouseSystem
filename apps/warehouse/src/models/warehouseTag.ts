import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Warehouse } from './warehouse';

@Entity({ name: 'warehouse_tags' })
export class WarehouseTag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ name: 'tag' })
  tag: string;

  warehouse: Warehouse;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;
}
