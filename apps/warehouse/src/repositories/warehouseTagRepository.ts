import { DataSource, Repository } from 'typeorm';
import { WarehouseTag } from '../models/warehouseTag';
import { Warehouse } from '../models/warehouse';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('warehouseTagRepository');

export class WarehouseTagRepository {
  private appDataSource: DataSource;
  private repository: Repository<WarehouseTag>;

  constructor(appDataSource: DataSource) {
    logger.debug('Creating WarehouseTagRepository');
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(WarehouseTag);
  }

  async create(tag: string, warehouse: Warehouse): Promise<WarehouseTag> {
    logger.debug('Creating warehouse tag', { tag, warehouse });
    const warehouseTag = this.repository.create({ tag, warehouse });
    return await this.repository.save(warehouseTag);
  }

  async update(updateData: Partial<WarehouseTag>): Promise<void> {
    logger.debug('Updating warehouse tag', { updateData });
    await this.repository.update(updateData.tagId, updateData);
  }

  async softDelete(tagId: number): Promise<void> {
    logger.debug('Soft deleting warehouse tag', { tagId });
    await this.repository.insert({ tagId, deletedAt: new Date() });
  }

  async hardDelete(tagId: number): Promise<void> {
    logger.warn('Hard deleting warehouse tag', { tagId });
    await this.repository.delete(tagId);
  }

  async findById(tagId: number): Promise<WarehouseTag | null> {
    logger.debug('Looking up warehouse tag by id', { tagId });
    return await this.repository.findOneBy({ tagId });
  }

  async findByTag(tag: string): Promise<WarehouseTag | null> {
    logger.debug('Looking up warehouse tag by tag', { tag });
    return await this.repository.findOne({ where: { tag } });
  }

  async findAll(): Promise<WarehouseTag[]> {
    logger.debug('Looking up all warehouse tags');
    return await this.repository.find();
  }

  async count(): Promise<number> {
    logger.debug('Counting all warehouse tags');
    return await this.repository.count();
  }
}
