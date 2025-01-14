import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'warehouse_users' })
export class WarehouseUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'warehouse_id' })
  warehouseId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'role' })
  role: string

  @Column({ name: 'created_at', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'updated_at', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date
}
