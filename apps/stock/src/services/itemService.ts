import { ItemRequest } from '../dto/request';
import { ApiResponse, ItemListResponse, ItemResponse } from '../dto/response';
import { ItemRepository } from '../repositories/itemRepository';

export class AuthService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async createItem(req: ItemRequest): Promise<ItemResponse> {
    const item = await this.itemRepository.create(
      req.warehouse_id,
      req.quantity,
      req.unit_price,
      req.unit_ammount,
      req.name,
      req.description
    );
    return ItemResponse.fromModel(item);
  }

  async updateItem(item_id: number, req: ItemRequest): Promise<ItemResponse> {
    // TODO: Refactor it, make in 1 query request
    const item = await this.itemRepository.findById(item_id);
    if (!item) {
      throw new Error('Item not found');
    }
    await this.itemRepository.update({ ...item, ...req });
    return ItemResponse.fromModel({ ...item, ...req });
  }

  async deleteItem(item_id: number): Promise<ApiResponse> {
    await this.itemRepository.softDelete(item_id);
    return new ApiResponse(200, 'success', 'Item deleted successfully');
  }

  async getItemsByWarehouse(warehouse_id: number): Promise<ItemListResponse> {
    const items = await this.itemRepository.findByWarehouse(warehouse_id);
    return ItemListResponse.fromModel(items);
  }

}
