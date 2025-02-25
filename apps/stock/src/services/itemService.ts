import { ApiResponse } from '@warehouse/validation';
import { CreateItemRequest, UpdateItemRequest } from '../dto/request';
import { ItemListResponse, ItemResponse } from '../dto/response';
import { ItemRepository } from '../repositories/itemRepository';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('itemService');

export class ItemService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    logger.info('Creating ItemService instance');
    this.itemRepository = itemRepository;
  }

  async createItem(req: CreateItemRequest): Promise<ItemResponse> {
    logger.debug('Creating new item', {
      warehouseId: req.warehouse_id,
      name: req.name
    });

    const item = await this.itemRepository.create(
      req.warehouse_id,
      req.quantity,
      req.unit_price,
      req.unit_ammount,
      req.name,
      req.description
    );

    logger.info('Item created successfully', {
      itemId: item.item_id,
      warehouseId: item.warehouse_id
    });

    return ItemResponse.from(item);
  }

  async updateItem(
    item_id: number,
    req: UpdateItemRequest
  ): Promise<ItemResponse> {
    logger.debug('Updating item', {
      itemId: item_id,
      updates: Object.keys(req)
    });

    const item = await this.itemRepository.findById(item_id);
    if (!item) {
      logger.warn('Item not found for update', { itemId: item_id });
      throw new Error('Item not found');
    }

    await this.itemRepository.update({ ...item, ...req });

    logger.info('Item updated successfully', {
      itemId: item_id,
      warehouseId: item.warehouse_id
    });

    return ItemResponse.from({ ...item, ...req });
  }

  async deleteItem(item_id: number): Promise<ApiResponse> {
    logger.debug('Deleting item', { itemId: item_id });

    await this.itemRepository.softDelete(item_id);

    logger.info('Item soft deleted successfully', {
      itemId: item_id
    });

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Item deleted successfully',
    });
  }

  async getItemsByWarehouse(warehouse_id: number): Promise<ItemListResponse> {
    logger.debug('Fetching items by warehouse', {
      warehouseId: warehouse_id
    });

    const items = await this.itemRepository.findByWarehouse(warehouse_id);

    logger.info('Retrieved warehouse items', {
      warehouseId: warehouse_id,
      count: items.length
    });

    return ItemListResponse.from({
      items: items.map((item) => ItemResponse.from(item)),
    });
  }

  async getItemById(
    warehouse_id: number,
    item_id: number
  ): Promise<ItemResponse> {
    logger.debug('Fetching item by ID and warehouse', {
      itemId: item_id,
      warehouseId: warehouse_id
    });

    const item = await this.itemRepository.findByIdAndWarehouse(
      item_id,
      warehouse_id
    );

    if (!item) {
      logger.warn('Item not found', {
        itemId: item_id,
        warehouseId: warehouse_id
      });
      return null;
    }

    logger.info('Item retrieved successfully', {
      itemId: item_id,
      warehouseId: warehouse_id
    });

    return ItemResponse.from(item);
  }
}
