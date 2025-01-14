import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import {Warehouse} from "./warehouse";

@Entity({ name: 'warehouse_tags' })
export class WarehouseTag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number

  @Column({ name: 'tag' })
  tag: string

  @ManyToOne(() => Warehouse, warehouse => warehouse.tags)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'created_at', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'updated_at', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date
}
