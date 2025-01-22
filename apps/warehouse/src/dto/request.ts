import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class WarehouseCreation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;
}

export class WarehouseUpdate {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsNumber()
  @IsNotEmpty()
  longitude?: number;

  @IsNumber()
  @IsNotEmpty()
  latitude?: number;
}
