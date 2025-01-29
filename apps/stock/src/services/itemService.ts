import { ApiResponse } from '@warehouse/validation';
import { CreateItemRequest, UpdateItemRequest } from '../dto/request';
import { ItemListResponse, ItemResponse } from '../dto/response';
import { ItemRepository } from '../repositories/itemRepository';

export class ItemService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async createItem(req: CreateItemRequest): Promise<ItemResponse> {
    const item = await this.itemRepository.create(
      req.warehouse_id,
      req.quantity,
      req.unit_price,
      req.unit_ammount,
      req.name,
      req.description
    );
    return ItemResponse.from(item);
  }

  async updateItem(
    item_id: number,
    req: UpdateItemRequest
  ): Promise<ItemResponse> {
    // TODO: Refactor it, make in 1 query request
    const item = await this.itemRepository.findById(item_id);
    if (!item) {
      throw new Error('Item not found');
    }
    await this.itemRepository.update({ ...item, ...req });
    return ItemResponse.from({ ...item, ...req });
  }

  async deleteItem(item_id: number): Promise<ApiResponse> {
    await this.itemRepository.softDelete(item_id);
    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Item deleted successfully',
    });
  }

  async getItemsByWarehouse(warehouse_id: number): Promise<ItemListResponse> {
    const items = await this.itemRepository.findByWarehouse(warehouse_id);
    return ItemListResponse.from({
      items: items.map((item) => ItemResponse.from(item)),
    });
  }

  async getItemById(
    warehouse_id: number,
    item_id: number
  ): Promise<ItemResponse> {
    const item = await this.itemRepository.findByIdAndWarehouse(
      item_id,
      warehouse_id
    );
    if (!item) {
      return null;
    }
    return ItemResponse.from(item);
  }
}
