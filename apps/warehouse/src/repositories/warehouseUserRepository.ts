import { DataSource, Repository } from 'typeorm';
import { WarehouseUser } from '../models/warehouseUser';
import { Warehouse } from '../models/warehouse';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('warehouseUserRepository');

export class WarehouseUserRepository {
  private appDataSource: DataSource;
  private repository: Repository<WarehouseUser>;

  constructor(appDataSource: DataSource) {
    logger.info('Creating WarehouseUserRepository');
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(WarehouseUser);
  }

  async create(
    warehouseId: Warehouse,
    userId: number,
    role: string
  ): Promise<WarehouseUser> {
    logger.debug('Creating warehouse user', { warehouseId, userId, role });
    const warehouseUser = this.repository.create({
      warehouse: warehouseId,
      userId,
      role,
    });
    return await this.repository.save(warehouseUser);
  }

  async update(updateData: Partial<WarehouseUser>): Promise<void> {
    logger.debug('Updating warehouse user', { updateData });
    await this.repository.update(updateData.id, updateData);
  }

  async softDelete(id: number): Promise<void> {
    logger.debug('Soft deleting warehouse user', { id });
    await this.repository.insert({ id, deletedAt: new Date() });
  }

  async hardDelete(id: number): Promise<void> {
    logger.warn('Hard deleting warehouse user', { id });
    await this.repository.delete(id);
  }

  async findUsersByWarehouse(warehouseId: Warehouse): Promise<number[]> {
    logger.debug('Finding users by warehouse', { warehouseId });
    const users = await this.repository.find({
      where: { warehouse: warehouseId },
      select: ['userId'],
    });
    return users.map((user) => user.userId);
  }

  async findUsersByRoleAndWarehouse(
    role: string,
    warehouseId: Warehouse
  ): Promise<WarehouseUser[]> {
    logger.debug('Finding users by role and warehouse', { role, warehouseId });
    return await this.repository.find({
      where: { role, warehouse: warehouseId },
    });
  }

  async findAll(): Promise<WarehouseUser[]> {
    logger.debug('Finding all warehouse users');
    return await this.repository.find();
  }

  async count(): Promise<number> {
    logger.debug('Counting warehouse users');
    return await this.repository.count();
  }
}
