import { WarehouseRepository } from '../repositories/warehouseRepository';
import {
  AssignUserRoleRequest,
  CreateRoleRequest,
  CreateTagRequest,
  CreateWarehouseRequest, RemoveUserRoleRequest,
  UpdateRoleRequest,
  UpdateTagRequest,
  UpdateWarehouseRequest,
} from '../dto/request';
import {
  WarehouseListResponse,
  WarehouseResponse,
  WarehouseRoleListResponse,
  WarehouseRoleResponse,
  WarehouseTagListResponse,
  WarehouseTagResponse, WarehouseUserRoleResponse,
} from '../dto/response';
import { ApiResponse } from '@warehouse/validation';
import {WarehouseTagRepository} from "../repositories/warehouseTagRepository";
import {WarehouseUserRepository} from "../repositories/warehouseUserRepository";
import {Warehouse} from "../models/warehouse";
import { validateOrReject } from 'class-validator';

export class WarehouseService {
  private warehouseRepository: WarehouseRepository;
  private warehouseTagRepository: WarehouseTagRepository;
  private warehouseUserRepository: WarehouseUserRepository;

  constructor(warehouseRepository: WarehouseRepository, warehouseTagRepository: WarehouseTagRepository, warehouseUserRepository: WarehouseUserRepository) {
    this.warehouseRepository = warehouseRepository;
    this.warehouseTagRepository = warehouseTagRepository;
    this.warehouseUserRepository = warehouseUserRepository;
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

  public async getAllTags(): Promise<WarehouseTagListResponse | ApiResponse> {
    try {
      // Find warehouses by tags using the repository
      const warehouses = await this.warehouseTagRepository.findAll();
      if (!warehouses || warehouses.length === 0) {
        return ApiResponse.from({
          message: 'No warehouses found for the provided tags.',
        });
      }

      // Transform the data into WarehouseResponse format
      const warehouseTagResponses = warehouses.map((warehouse) =>
        WarehouseTagResponse.from({
          tagId: warehouse.tagId,
          tag: warehouse.tag,
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
    warehouseId: Warehouse,
    req: CreateTagRequest
  ): Promise<WarehouseTagResponse | ApiResponse> {
    try {
      // Create the warehouse using repository
      const warehouse = await this.warehouseTagRepository.create(
        req.tag,
        warehouseId
      );

      if (!warehouse) {
        return ApiResponse.from({
          message: 'Failed to create warehouse with the provided tag.',
        });
      }

      // Transform the created warehouse into WarehouseResponse format
      return WarehouseTagResponse.from({
        tagId: warehouse.tagId,
        tag: req.tag,
        createdAt: warehouse.createdAt,
        updatedAt: warehouse.updatedAt
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
    req: UpdateTagRequest
  ): Promise<WarehouseTagResponse | ApiResponse> {
    try {
      // Find existing tag by its ID using the repository
      const existingTag = await this.warehouseTagRepository.findById(req.id);

      if (!existingTag) {
        return ApiResponse.from({
          message: `Tag with id ${req.id} not found`,
        });
      }

      // Update the tag data using the repository
      await this.warehouseTagRepository.update({
        tagId: req.id,
        tag: existingTag.tag,
        createdAt: existingTag.createdAt,
        updatedAt: existingTag.updatedAt,
      });

      // Transform the updated tag into the response format
      return WarehouseTagResponse.from({
        tagId: req.id,
        tag: existingTag.tag,
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
      const existingTag = await this.warehouseTagRepository.findById(id);

      if (!existingTag) {
        return ApiResponse.from({
          message: `Tag with id ${id} not found`,
        });
      }

      // Soft delete the tag using the repository
      await this.warehouseTagRepository.softDelete(id);

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
      // Fetch all users from the repository
      const users = await this.warehouseUserRepository.findAll();

      if (!users || users.length === 0) {
        return ApiResponse.from({
          message: 'No users found',
        });
      }

      // Transform the users into RoleResponse format
      const userResponses = users.map((user) =>
        WarehouseRoleResponse.from({
          id: user.id,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      );
      // Return the users in a RoleListResponse format
      return WarehouseRoleListResponse.from({ roles: userResponses });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async createRole(
    id: number,
    req: CreateRoleRequest,
    warehouseId: Warehouse
  ): Promise<WarehouseRoleResponse | ApiResponse> {
    try {
      // Create the new role using the repository
      const createdRole = await this.warehouseUserRepository.create(
        warehouseId,
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

  public async updateRoleById(
    req: UpdateRoleRequest
  ): Promise<WarehouseRoleResponse | ApiResponse> {
    try {
      // Validate request object
      await validateOrReject(req);

      // Find the existing WarehouseUser by ID
      const existingUser = await this.warehouseUserRepository.findAll();
      const user = existingUser.find((user) => user.id === req.id);

      if (!user) {
        return ApiResponse.from({
          code: 404,
          type: 'Not Found',
          message: `WarehouseUser with ID ${req.id} not found`,
        });
      }

      // Update the role
      user.role = req.role;
      await this.warehouseUserRepository.update(user);

      return WarehouseRoleResponse.from({
        id: user.id,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      });
    } catch (error) {
      return ApiResponse.from({
        code: 400,
        type: 'Bad Request',
        message: `Validation or Update Error: ${error}`,
      });
      }
  }

  public async deleteRoleById(id: number): Promise<ApiResponse> {
    try {
      // Find the existing WarehouseUser by ID
      const existingUser = await this.warehouseUserRepository.findAll();
      const user = existingUser.find((user) => user.id === id);

      if (!user) {
        return ApiResponse.from({
          code: 404,
          type: 'Not Found',
          message: `WarehouseUser with ID ${id} not found`,
        });
      }

      // Soft delete the user by updating the deletedAt field
      await this.warehouseUserRepository.softDelete(id);

      return ApiResponse.from({
        code: 200,
        type: 'Success',
        message: `WarehouseUser with ID ${id} successfully deleted`,
      });
    } catch (error) {
      return ApiResponse.from({
        code: 500,
        type: 'Internal Server Error',
        message: `Error deleting WarehouseUser with ID ${id}: ${error}`,
      });
    }
  }

  public async assignUserRole(
    req: AssignUserRoleRequest,
    warehouseId: Warehouse
  ): Promise<WarehouseUserRoleResponse | ApiResponse> {
    try {
      // Validate request object
      await validateOrReject(req);

      // Check if the user already has a role in the warehouse
      const existingUsers = await this.warehouseUserRepository.findUsersByWarehouse(warehouseId);
      if (existingUsers.includes(req.userId)) {
        return ApiResponse.from({
          code: 400,
          type: 'Bad Request',
          message: `User with ID ${req.userId} already has a role in the specified warehouse`,
        });
      }

      // Assign the role to the user
      const newUserRole = await this.warehouseUserRepository.create(
        warehouseId,
        req.userId,
        req.role
      );
      return WarehouseUserRoleResponse.from({
        userId: newUserRole.id,
        role: newUserRole.role,
        assignedAt: newUserRole.createdAt,
      });
    } catch (error) {
      return ApiResponse.from({
        code: 500,
        type: 'Internal Server Error',
        message: `Error assigning role to user: ${error}`,
      });
    }
  }

  public async removeUserRole(req: RemoveUserRoleRequest): Promise<ApiResponse> {
    try {
      // Validate request object
      await validateOrReject(req);

      // Find the user-role association in the warehouse
      const usersWithRole = await this.warehouseUserRepository.findUsersByRoleAndWarehouse(
        req.role,
        { id: req.userId } as Warehouse
      );

      if (usersWithRole.length === 0) {
        return ApiResponse.from({
          code: 404,
          type: 'Not Found',
          message: `User with ID ${req.userId} and role ${req.role} not found in the specified warehouse`,
        });
      }

      // Perform soft delete of the user role
      await this.warehouseUserRepository.softDelete(req.userId);

      return ApiResponse.from({
        code: 200,
        type: 'Success',
        message: `Role ${req.role} successfully removed from user with ID ${req.userId}`,
      });
    } catch (error) {
      return ApiResponse.from({
        code: 500,
        type: 'Internal Server Error',
        message: `Error removing role from user: ${error}`,
      });
    }
  }
}
