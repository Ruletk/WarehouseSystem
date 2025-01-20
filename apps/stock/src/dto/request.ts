import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

// DTO для создания записи о складе
export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  stockName: string; // Название склада

  @IsNumber()
  @Min(1)
  @Max(10000)
  stockQuantity: number; // Количество на складе
}

// DTO для обновления записи о складе
export class UpdateStockDto {
  @IsString()
  @IsNotEmpty()
  stockId: string; // Идентификатор склада

  @IsOptional()
  @IsString()
  stockName?: string; // Обновленное название склада

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  stockQuantity?: number; // Обновленное количество
}
