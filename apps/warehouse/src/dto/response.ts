import { BaseResponse } from '@warehouse/validation';

export class WarehouseResponse extends BaseResponse {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class WarehouseList extends BaseResponse{
  data: WarehouseResponse[];
}
