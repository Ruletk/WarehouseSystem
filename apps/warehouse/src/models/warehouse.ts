import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'warehouses' })
export class Warehouse {
  @PrimaryGeneratedColumn({ name: 'warehouse_id' })
    id: number

  @Column({ name: 'name', unique: true })
  name: string

  @Column({ name: 'latitude', nullable: true })
  latitude: number

  @Column({ name: 'longitude', nullable: true })
  longitude: number

  @Column({ name: 'address', nullable: true })
  address: string

  @Column({ name: 'created_at', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'updated_at', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date
}
