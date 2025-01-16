import { Item } from '../models/item';

export class ItemResponse {
  constructor(data = null) {
    this.id = data?.id;
    this.name = data?.name;
    this.description = data?.description;
    this.quantity = data?.quantity;
    this.unit_price = data?.unit_price;
    this.unit_ammount = data?.unit_ammount;
    this.total_price = data?.unit_price * data?.unit_ammount;
    this.warehouse_id = data?.warehouse_id;
    this.created_at = data?.created_at;
    this.updated_at = data?.updated_at;
  }
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  unit_ammount: number;
  total_price: number;
  warehouse_id: number;
  created_at: Date;
  updated_at: Date;

  static fromModel(model: Item): ItemResponse {
    return new ItemResponse({
      id: model.item_id,
      name: model.name,
      description: model.description,
      quantity: model.quantity,
      unit_price: model.unit_price,
      unit_ammount: model.unit_ammount,
      warehouse_id: model.warehouse_id,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });
  }
}

export class ItemListResponse {
  constructor(data = null) {
    this.stocks = data?.stocks;
  }
  stocks: ItemResponse[];

  static fromModel(models: Item[]): ItemListResponse {
    return new ItemListResponse({
      stocks: models.map((model) => ItemResponse.fromModel(model)),
    });
  }
}

export class ApiResponse {
  constructor(code: number, type: string, message: string) {
    this.code = code;
    this.type = type;
    this.message = message;
  }

  code: number;
  type: string;
  message: string;
}
