import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateWarehouseRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  address?: string;
}

export class CreateTagRequest {
  @IsString()
  @IsNotEmpty()
  tag: string;
}

export class UpdateTagRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  tag: string;
}

export class CreateRoleRequest {
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class UpdateRoleRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class AssignUserRoleRequest {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class RemoveUserRoleRequest {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
