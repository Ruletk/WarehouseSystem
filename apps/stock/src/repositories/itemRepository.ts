import { DataSource, Repository } from 'typeorm';
import { Item } from '../models/item';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('itemRepository');

export class ItemRepository {
  private appDataSource: DataSource;
  private repository: Repository<Item>;

  constructor(appDataSource: DataSource) {
    logger.info('Creating ItemRepository instance');
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(Item);
  }

  async create(
    warehouse_id: number,
    quantity: number,
    unit_price: number,
    unit_ammount: number,
    name: string,
    description: string
  ): Promise<Item> {
    logger.debug('Creating new item', {
      warehouse_id,
      name,
      quantity
    });

    const item = this.repository.create({
      warehouse_id,
      quantity,
      unit_price,
      unit_ammount,
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const saved = await this.repository.save(item);
    logger.info('Item created successfully', {
      itemId: saved.item_id,
      warehouseId: saved.warehouse_id
    });

    return saved;
  }

  async update(updateData: Partial<Item>): Promise<void> {
    logger.debug('Updating item', {
      itemId: updateData.item_id
    });

    await this.repository.update(updateData.item_id, updateData);
    logger.info('Item updated successfully', {
      itemId: updateData.item_id
    });
  }

  async softDelete(item_id: number): Promise<void> {
    logger.warn('Soft deleting item', { itemId: item_id });

    await this.repository
      .createQueryBuilder()
      .where('item_id = :item_id', { item_id })
      .update()
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .execute();

    logger.info('Item soft deleted', { itemId: item_id });
  }

  async hardDelete(item_id: number): Promise<void> {
    logger.warn('Permanently deleting item', { itemId: item_id });

    await this.repository.delete({ item_id });
    logger.info('Item permanently deleted', { itemId: item_id });
  }

  async findById(item_id: number): Promise<Item | null> {
    logger.debug('Looking up item by ID', { itemId: item_id });

    const item = await this.repository.findOneBy({ item_id });
    logger.info('Item lookup completed', {
      itemId: item_id,
      found: !!item
    });

    return item;
  }

  async findByIdAndWarehouse(
    item_id: number,
    warehouse_id: number
  ): Promise<Item | null> {
    logger.debug('Looking up item by ID and warehouse', {
      itemId: item_id,
      warehouseId: warehouse_id
    });

    const item = await this.repository.findOneBy({ item_id });
    logger.info('Item warehouse lookup completed', {
      itemId: item_id,
      warehouseId: warehouse_id,
      found: !!item
    });

    return item;
  }

  async findByName(name: string): Promise<Item[]> {
    logger.debug('Searching items by name', {
      namePattern: `%${name}%`
    });

    const items = await this.repository
      .createQueryBuilder('item')
      .where('item.name ILIKE :name', { name: `%${name}%` })
      .getMany();

    logger.info('Name search completed', {
      searchTerm: name,
      resultsCount: items.length
    });

    return items;
  }

  async findAll(): Promise<Item[]> {
    logger.debug('Fetching all items');

    const items = await this.repository.find();
    logger.info('Retrieved all items', {
      count: items.length
    });

    return items;
  }

  async findByWarehouse(warehouse_id: number): Promise<Item[]> {
    logger.debug('Fetching items by warehouse', {
      warehouseId: warehouse_id
    });

    const items = await this.repository.find({ where: { warehouse_id } });
    logger.info('Warehouse items retrieved', {
      warehouseId: warehouse_id,
      count: items.length
    });

    return items;
  }

  async count(): Promise<number> {
    logger.debug('Counting total items');

    const count = await this.repository.count();
    logger.info('Item count completed', { total: count });

    return count;
  }
}
