import { BaseResponse } from '@warehouse/validation';
import { Expose } from 'class-transformer';

export class WarehouseResponse extends BaseResponse {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  latitude?: number;

  @Expose()
  longitude?: number;

  @Expose()
  address?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class WarehouseListResponse extends BaseResponse {
  @Expose()
  warehouses!: WarehouseResponse[];
}

// Ответ для операций с Tags
export class WarehouseTagResponse extends BaseResponse {
  @Expose()
  tagId!: number;

  @Expose()
  tag!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class WarehouseTagListResponse extends BaseResponse {
  @Expose()
  tags!: WarehouseTagResponse[];
}

// Ответ для операций с Roles
export class WarehouseRoleResponse extends BaseResponse {
  @Expose()
  id!: number;

  @Expose()
  role!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class WarehouseRoleListResponse extends BaseResponse {
  @Expose()
  roles!: WarehouseRoleResponse[];
}

// Ответ для операций с пользователями внутри ролей
export class WarehouseUserRoleResponse extends BaseResponse {
  @Expose()
  userId!: number;

  @Expose()
  role!: string;

  @Expose()
  assignedAt!: Date;
}

export class WarehouseUserRoleListResponse extends BaseResponse {
  @Expose()
  users!: WarehouseUserRoleResponse[];
}
