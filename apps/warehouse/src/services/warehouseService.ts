import { WarehouseRepository } from '../repositories/warehouseRepository';
import { CreateWarehouseRequest, UpdateWarehouseRequest } from '../dto/request';
import { WarehouseListResponse, WarehouseResponse } from '../dto/response';
import { ApiResponse } from '@warehouse/validation';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('warehouseService');

export class WarehouseService {
  private warehouseRepository: WarehouseRepository;

  constructor(warehouseRepository: WarehouseRepository) {
    logger.info('Creating WarehouseService instance');
    this.warehouseRepository = warehouseRepository;
  }

  public async createWarehouse(
    req: CreateWarehouseRequest
  ): Promise<WarehouseResponse | ApiResponse> {
    logger.debug('Creating new warehouse', {
      name: req.name,
      address: req.address
    });

    try {
      const warehouse = await this.warehouseRepository.create(
        req.name,
        req.latitude,
        req.longitude,
        req.address
      );

      logger.info('Warehouse created successfully', {
        warehouseId: warehouse.id,
        name: warehouse.name
      });

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
      logger.error('Failed to create warehouse', {
        error: error.message,
        name: req.name
      });
      throw error;
    }
  }

  public async getAllWarehouses(): Promise<WarehouseListResponse | ApiResponse> {
    logger.debug('Fetching all warehouses');

    try {
      const warehouses = await this.warehouseRepository.findAll();

      logger.info('Retrieved all warehouses', {
        count: warehouses.length
      });

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

      return WarehouseListResponse.from({ warehouses: warehouseResponses });
    } catch (error) {
      logger.error('Failed to fetch warehouses', {
        error: error.message
      });
      return ApiResponse.from({
        message: 'Failed to retrieve warehouse list',
      });
    }
  }

  public async updateWarehouseById(
    req: UpdateWarehouseRequest
  ): Promise<WarehouseResponse | ApiResponse> {
    const { id, name, latitude, longitude, address } = req;

    logger.debug('Updating warehouse', {
      warehouseId: id,
      name: name || 'unchanged'
    });

    try {
      const existingWarehouse = await this.warehouseRepository.findById(id);

      if (!existingWarehouse) {
        logger.warn('Warehouse not found for update', { warehouseId: id });
        return ApiResponse.from({
          message: `Warehouse with id ${id} not found`,
        });
      }

      await this.warehouseRepository.update({
        id,
        name: name ?? existingWarehouse.name,
        latitude: latitude ?? existingWarehouse.latitude,
        longitude: longitude ?? existingWarehouse.longitude,
        address: address ?? existingWarehouse.address,
      });

      const updatedWarehouse = await this.warehouseRepository.findById(id);

      logger.info('Warehouse updated successfully', {
        warehouseId: id,
        name: updatedWarehouse?.name
      });

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
      logger.error('Failed to update warehouse', {
        warehouseId: id,
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async deleteWarehouseById(id: number): Promise<ApiResponse> {
    logger.debug('Deleting warehouse', { warehouseId: id });

    try {
      const existingWarehouse = await this.warehouseRepository.findById(id);

      if (!existingWarehouse) {
        logger.warn('Warehouse not found for deletion', { warehouseId: id });
        return ApiResponse.from({
          message: `Warehouse with id ${id} not found`,
        });
      }

      await this.warehouseRepository.softDelete(id);

      logger.info('Warehouse deleted successfully', { warehouseId: id });

      return ApiResponse.from({
        message: 'Warehouse deleted successfully',
      });
    } catch (error) {
      logger.error('Failed to delete warehouse', {
        warehouseId: id,
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async getWarehouseById(
    id: number
  ): Promise<WarehouseResponse | ApiResponse> {
    logger.debug('Fetching warehouse by ID', { warehouseId: id });

    try {
      const warehouse = await this.warehouseRepository.findById(id);

      if (!warehouse) {
        logger.warn('Warehouse not found', { warehouseId: id });
        return ApiResponse.from({
          message: `Warehouse with id ${id} not found`,
        });
      }

      logger.info('Warehouse retrieved successfully', {
        warehouseId: id,
        name: warehouse.name
      });

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
      logger.error('Failed to fetch warehouse', {
        warehouseId: id,
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
}
