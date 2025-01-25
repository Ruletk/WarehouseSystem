import { WarehouseRepository } from '../repositories/warehouseRepository';
import { CreateWarehouseRequest } from '../dto/request';
import { WarehouseListResponse, WarehouseResponse } from '../dto/response';
import { ApiResponse } from '@warehouse/validation';

export class WarehouseService {
  private warehouseRepository: WarehouseRepository;

  constructor(warehouseRepository: WarehouseRepository) {
    this.warehouseRepository = warehouseRepository;
  }

  public async createWarehouse(
    req: CreateWarehouseRequest
  ): Promise<WarehouseResponse | ApiResponse> {
    try {
      // Create a new warehouse instance
      const warehouse = await this.warehouseRepository.create(
        req.name,
        req.latitude,
        req.longitude,
        req.address
      );

      return WarehouseResponse.from({
        id: warehouse.id,
        name: warehouse.name,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        address: warehouse.address,
        createdAt: warehouse.createdAt,
        updatedAt: warehouse.updatedAt,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getAllWarehouses(): Promise<
    WarehouseListResponse | ApiResponse
  > {
    try {
      // Получаем все склады из репозитория
      const warehouses = await this.warehouseRepository.findAll();

      // Преобразуем данные в формат WarehouseResponse
      const warehouseResponses = warehouses.map((warehouse) =>
        WarehouseResponse.from({
          id: warehouse.id,
          name: warehouse.name,
          latitude: warehouse.latitude,
          longitude: warehouse.longitude,
          address: warehouse.address,
          createdAt: warehouse.createdAt,
          updatedAt: warehouse.updatedAt,
        })
      );

      // Возвращаем результат
      return WarehouseListResponse.from({ warehouses: warehouseResponses });
    } catch (error) {
      console.error('Ошибка при получении складов:', error);
      return ApiResponse.from({
        message: 'Не удалось получить список складов.',
      });
    }
  }
}
