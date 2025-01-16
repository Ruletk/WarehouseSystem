import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn({ name: 'id' })
  item_id: number;

  @Column({ name: 'warehouse_id', default: 0 })
  warehouse_id: number;

  @Column({ name: 'product_id', default: 0 })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  unit_price: number;

  @Column({
    name: 'unit_ammount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  unit_ammount: number;

  @Column({ name: 'name', unique: true, length: 255 })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  deleted_at: Date;

  @Column({ name: 'extra_fields', type: 'json', nullable: true })
  extra_fields: Record<string, any>;
}
