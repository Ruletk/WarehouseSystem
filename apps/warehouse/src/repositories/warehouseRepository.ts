import { DataSource, Repository } from 'typeorm';
import { Warehouse } from '../models/warehouse';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('warehouseRepository');

export class WarehouseRepository {
  private appDataSource: DataSource;
  private repository: Repository<Warehouse>;

  constructor(appDataSource: DataSource) {
    logger.info('Creating WarehouseRepository instance');
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(Warehouse);
  }

  async create(
    name: string,
    latitude: number,
    longitude: number,
    address: string
  ): Promise<Warehouse> {
    logger.debug('Creating warehouse', { name, latitude, longitude, address });
    const warehouse = this.repository.create({
      name,
      latitude,
      longitude,
      address,
    });

    return await this.repository.save(warehouse);
  }

  async update(updateData: Partial<Warehouse>): Promise<void> {
    logger.debug('Updating warehouse', { updateData });
    await this.repository.update(updateData.id, updateData);
  }

  async softDelete(id: number): Promise<void> {
    logger.debug('Soft deleting warehouse', { id });
    await this.repository.insert({ id, deletedAt: new Date() });
  }

  async hardDelete(id: number): Promise<void> {
    logger.warn('Hard deleting warehouse', { id });
    await this.repository.delete(id);
  }

  async findById(id: number): Promise<Warehouse | null> {
    logger.debug('Looking up warehouse by id', { id });
    return await this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Warehouse | null> {
    logger.debug('Looking up warehouse by name', { name });
    return await this.repository.findOne({ where: { name } });
  }

  async findByTagName(tagName: string): Promise<Warehouse[]> {
    logger.debug('Looking up warehouses by tag name', { tagName });
    return await this.repository
      .createQueryBuilder('warehouse')
      .innerJoin('warehouse.tags', 'tag')
      .where('tag.name = :tagName', { tagName })
      .getMany();
  }

  async findWarehousesByUserId(userId: number): Promise<Warehouse[]> {
    logger.debug('Looking up warehouses by user ID', { userId });
    return await this.repository
      .createQueryBuilder('warehouse')
      .innerJoin('warehouse.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findAll(): Promise<Warehouse[]> {
    logger.debug('Looking up all warehouses');
    return await this.repository.find();
  }

  async count(): Promise<number> {
    logger.debug('Counting warehouses');
    return await this.repository.count();
  }
}
