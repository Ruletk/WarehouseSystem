import { WarehouseRepository } from '../repositories/warehouseRepository';
import {
  CreateRoleRequest,
  CreateTagRequest,
  CreateWarehouseRequest, UpdateRoleRequest,
  UpdateTagRequest,
  UpdateWarehouseRequest,
} from '../dto/request';
import {
  WarehouseListResponse,
  WarehouseResponse,
  WarehouseRoleListResponse,
  WarehouseRoleResponse,
  WarehouseTagListResponse,
  WarehouseTagResponse,
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

  public async getAllTags(
    tag: string
  ): Promise<WarehouseTagListResponse | ApiResponse> {
    try {
      // Find warehouses by tags using the repository
      const warehouses = await this.warehouseRepository.findByTagName(tag);
      if (!warehouses || warehouses.length === 0) {
        return ApiResponse.from({
          message: 'No warehouses found for the provided tags.',
        });
      }

      // Transform the data into WarehouseResponse format
      const warehouseTagResponses = warehouses.map((warehouse) =>
        WarehouseTagResponse.from({
          tagId: warehouse.id,
          tag: warehouse.name,
          createdAt: warehouse.createdAt,
          updatedAt: warehouse.updatedAt,
        })
      );

      // Return the response
      return WarehouseTagListResponse.from({ tags: warehouseTagResponses });
    } catch (error) {
      // Handle errors
      console.error('Error fetching warehouses by tags:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async createTag(
    tag: string,
    req: CreateTagRequest
  ): Promise<WarehouseTagResponse | ApiResponse> {
    try {
      // Create the warehouse using repository
      const warehouse = await this.warehouseRepository.createTag(req.tag);

      if (!warehouse) {
        return ApiResponse.from({
          message: 'Failed to create warehouse with the provided tag.',
        });
      }

      // Transform the created warehouse into WarehouseResponse format
      return WarehouseTagResponse.from({
        tag,
      });
    } catch (error) {
      console.error('Error creating warehouse with tag:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async updateTagById(
    id: number,
    req: UpdateTagRequest
  ): Promise<WarehouseTagResponse | ApiResponse> {
    try {
      // Find existing tag by its ID using the repository
      const existingTag = await this.warehouseRepository.findById(id);

      if (!existingTag) {
        return ApiResponse.from({
          message: `Tag with id ${id} not found`,
        });
      }

      // Update the tag data using the repository
      await this.warehouseRepository.update({
        id: id,
        name: req.tag,
      });

      // Transform the updated tag into the response format
      return WarehouseTagResponse.from({
        tagId: id,
        tag: existingTag.name,
        createdAt: existingTag.createdAt,
        updatedAt: existingTag.updatedAt,
      });
    } catch (error) {
      console.error('Error updating tag by id:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async deleteTagById(id: number): Promise<ApiResponse> {
    try {
      // Find the tag by its ID using the repository
      const existingTag = await this.warehouseRepository.findById(id);

      if (!existingTag) {
        return ApiResponse.from({
          message: `Tag with id ${id} not found`,
        });
      }

      // Soft delete the tag using the repository
      await this.warehouseRepository.softDelete(id);

      // Return a successful response
      return ApiResponse.from({
        message: 'Tag deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting tag by id:', error);

      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async getAllRoles(): Promise<WarehouseRoleListResponse | ApiResponse> {
    try {
      // Fetch all roles from the repository
      const roles = await this.warehouseRepository.findAll();

      if (!roles || roles.length === 0) {
        return ApiResponse.from({
          message: 'No roles found',
        });
      }

      // Transform the roles into RoleResponse format
      const roleResponses = roles.map((role) =>
        WarehouseRoleResponse.from({
          id: role.id,
          role: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        })
      );
      // Return the roles in a RoleListResponse format
      return WarehouseRoleListResponse.from({ roles: roleResponses });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async createRoleById(
    id: number,
    req: CreateRoleRequest
  ): Promise<WarehouseRoleResponse | ApiResponse> {
    try {
      // Check if the role already exists by its ID
      const existingRole = await this.warehouseRepository.findById(id);

      if (existingRole) {
        return ApiResponse.from({
          message: "Role with id ${id} already exists",
        });
      }

      // Create the new role using the repository
      const createdRole = await this.warehouseRepository.createRole(
        id,
        req.role
      );

      if (!createdRole) {
        return ApiResponse.from({
          message: 'Failed to create role',
        });
      }

      // Transform the created role into the response format
      return WarehouseRoleResponse.from({
        id: createdRole.id,
        role: createdRole.role,
        createdAt: createdRole.createdAt,
        updatedAt: createdRole.updatedAt,
      });
    } catch (error) {
      console.error('Error creating role by id:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }


}
