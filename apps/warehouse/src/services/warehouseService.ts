import { WarehouseRepository } from '../repositories/warehouseRepository';
import {
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from '../dto/request';
import {
  WarehouseListResponse,
  WarehouseResponse
} from '../dto/response';
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

  public async updateWarehouseById(
    req: UpdateWarehouseRequest
  ): Promise<WarehouseResponse | ApiResponse> {
    const { id, name, latitude, longitude, address } = req;

    try {
      // Найти склад по идентификатору
      const existingWarehouse = await this.warehouseRepository.findById(id);

      if (!existingWarehouse) {
        return ApiResponse.from({
          message: 'Warehouse with id ${id} not found',
        });
      }

      // Обновить склад с новыми данными
      await this.warehouseRepository.update({
        id,
        name: name ?? existingWarehouse.name,
        latitude: latitude ?? existingWarehouse.latitude,
        longitude: longitude ?? existingWarehouse.longitude,
        address: address ?? existingWarehouse.address,
      });

      // Получить обновленный склад
      const updatedWarehouse = await this.warehouseRepository.findById(id);

      if (!updatedWarehouse) {
        return ApiResponse.from({
          message: 'Failed to retrieve updated warehouse with id ${id}',
        });
      }

      // Вернуть успешный ответ с информацией о складе
      return WarehouseResponse.from({
        id: updatedWarehouse.id,
        name: updatedWarehouse.name,
        latitude: updatedWarehouse.latitude,
        longitude: updatedWarehouse.longitude,
        address: updatedWarehouse.address,
        createdAt: updatedWarehouse.createdAt,
        updatedAt: updatedWarehouse.updatedAt,
      });
    } catch (error) {
      // Обработка ошибок
      console.error('Error updating warehouse:', error);

      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async deleteWarehouseById(id: number): Promise<ApiResponse> {
    try {
      // Найти склад по идентификатору
      const existingWarehouse = await this.warehouseRepository.findById(id);

      if (!existingWarehouse) {
        return ApiResponse.from({
          message: 'Warehouse with id ${id} not found',
        });
      }

      // Мягкое удаление склада
      await this.warehouseRepository.softDelete(id);

      // Возвращаем успешный ответ
      return ApiResponse.from({
        message: 'Warehouse deleted successfully',
      });
    } catch (error) {
      // Обработка ошибок
      console.error('Error deleting warehouse:', error);

      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async getWarehouseById(
    id: number
  ): Promise<WarehouseResponse | ApiResponse> {
    try {
      // Найти склад по идентификатору
      const warehouse = await this.warehouseRepository.findById(id);

      if (!warehouse) {
        return ApiResponse.from({
          message: 'Warehouse with id ${id} not found',
        });
      }

      // Возвращаем информацию о складе в формате WarehouseResponse
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
      // Обработка ошибок
      console.error('Error fetching warehouse by id:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
}
