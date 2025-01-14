import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'warehouse_tags' })
export class WarehouseTag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number

  @Column({ name: 'tag' })
  tag: string

  @Column({ name: 'warehouse_id' })
  warehouseId: number

  @Column({ name: 'created_at', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'updated_at', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date
}
