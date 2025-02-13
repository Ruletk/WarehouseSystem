import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateItemRequest {
  @IsNumber()
  @IsNotEmpty()
  warehouse_id: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unit_price: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unit_ammount: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateItemRequest {
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unit_price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unit_ammount?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
