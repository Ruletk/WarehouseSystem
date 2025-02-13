import { Expose } from 'class-transformer';
import { BaseResponse } from '@warehouse/validation';

export class ItemResponse extends BaseResponse {
  @Expose()
  item_id: number;

  @Expose()
  warehouse_id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  quantity: number;

  @Expose()
  unit_price: number;

  @Expose()
  unit_ammount: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

}

export class ItemListResponse extends BaseResponse {
  @Expose()
  items: ItemResponse[];

}
