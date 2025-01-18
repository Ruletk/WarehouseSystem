import { DataSource, Repository } from 'typeorm';
import { WarehouseUser } from '../models/warehouseUser';
import {Warehouse} from "../models/warehouse";

export class WarehouseUserRepository {
  private appDataSource: DataSource;
  private repository: Repository<WarehouseUser>;

  constructor(appDataSource: DataSource) {
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(WarehouseUser);
  }

  async create(warehouseId: Warehouse, userId: number, role: string): Promise<WarehouseUser> {
    const warehouseUser = this.repository.create({ warehouse: warehouseId, userId, role });
    return await this.repository.save(warehouseUser);
  }

  async update(updateData: Partial<WarehouseUser>): Promise<void> {
    await this.repository.update(updateData.id, updateData);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.insert({ id, deletedAt: new Date() });
  }

  async hardDelete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findUsersByWarehouse(warehouseId: Warehouse): Promise<number[]> {
    const users = await this.repository.find({
      where: { warehouse: warehouseId },
      select: ['userId'],
    });
    return users.map((user) => user.userId);
  }

  async findUsersByRoleAndWarehouse(role: string, warehouseId: Warehouse): Promise<WarehouseUser[]> {
    return await this.repository.find({
      where: { role, warehouse: warehouseId },
    });
  }

  async findAll(): Promise<WarehouseUser[]> {
    return await this.repository.find();
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
