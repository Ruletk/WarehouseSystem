import {
  AssignUserRoleRequest,
  CreateRoleRequest,RemoveUserRoleRequest,
  UpdateRoleRequest,
} from '../dto/request';
import {
  WarehouseRoleListResponse,
  WarehouseRoleResponse, WarehouseUserRoleResponse,
} from '../dto/response';
import { ApiResponse } from '@warehouse/validation';
import {WarehouseUserRepository} from "../repositories/warehouseUserRepository";
import {Warehouse} from "../models/warehouse";
import { validateOrReject } from 'class-validator';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('warehouseUserService');

export class WarehouseUserService {
  private warehouseUserRepository: WarehouseUserRepository;

  constructor(warehouseUserRepository: WarehouseUserRepository) {
    logger.info('Creating WarehouseUserService instance');
    this.warehouseUserRepository = warehouseUserRepository;
  }

  public async getAllRoles(): Promise<WarehouseRoleListResponse | ApiResponse> {
    logger.debug('Fetching all warehouse roles');

    try {
      // Fetch all users from the repository
      const users = await this.warehouseUserRepository.findAll();

      if (!users || users.length === 0) {
        logger.info('No users found');
        return ApiResponse.from({
          message: 'No users found',
        });
      }

      logger.info('Retrieved all user roles', {
        count: users.length
      });

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
      logger.error('Failed to fetch roles', {
        error: error.message
      });
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
    logger.debug('Creating new role', {
      userId: id,
      warehouseId: warehouseId.id,
      role: req.role
    });

    try {
      // Create the new role using the repository
      const createdRole = await this.warehouseUserRepository.create(
        warehouseId,
        id,
        req.role
      );

      if (!createdRole) {
        logger.warn('Failed to create role', {
          userId: id,
          warehouseId: warehouseId.id
        });
        return ApiResponse.from({
          message: 'Failed to create role',
        });
      }

      logger.info('Role created successfully', {
        roleId: createdRole.id,
        userId: id,
        warehouseId: warehouseId.id
      });

      // Transform the created role into the response format
      return WarehouseRoleResponse.from({
        id: createdRole.id,
        role: createdRole.role,
        createdAt: createdRole.createdAt,
        updatedAt: createdRole.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to create role', {
        userId: id,
        warehouseId: warehouseId.id,
        error: error.message
      });
      return ApiResponse.from({
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async updateRoleById(
    req: UpdateRoleRequest
  ): Promise<WarehouseRoleResponse | ApiResponse> {
    logger.debug('Updating role', { roleId: req.id });

    try {
      // Validate request object
      await validateOrReject(req);

      // Find the existing WarehouseUser by ID
      const existingUser = await this.warehouseUserRepository.findAll();
      const user = existingUser.find((user) => user.id === req.id);

      if (!user) {
        logger.warn('User not found for role update', { userId: req.id });
        return ApiResponse.from({
          code: 404,
          type: 'Not Found',
          message: `WarehouseUser with ID ${req.id} not found`,
        });
      }

      // Update the role
      user.role = req.role;
      await this.warehouseUserRepository.update(user);

      logger.info('Role updated successfully', {
        userId: user.id,
        newRole: user.role
      });

      return WarehouseRoleResponse.from({
        id: user.id,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      });
    } catch (error) {
      logger.error('Failed to update role', {
        roleId: req.id,
        error: error.message
      });
      return ApiResponse.from({
        code: 400,
        type: 'Bad Request',
        message: `Validation or Update Error: ${error}`,
      });
    }
  }

  public async deleteRoleById(id: number): Promise<ApiResponse> {
    logger.debug('Deleting role', { roleId: id });

    try {
      // Find the existing WarehouseUser by ID
      const existingUser = await this.warehouseUserRepository.findAll();
      const user = existingUser.find((user) => user.id === id);

      if (!user) {
        logger.warn('User not found for role deletion', { userId: id });
        return ApiResponse.from({
          code: 404,
          type: 'Not Found',
          message: `WarehouseUser with ID ${id} not found`,
        });
      }

      // Soft delete the user by updating the deletedAt field
      await this.warehouseUserRepository.softDelete(id);

      logger.info('Role deleted successfully', { userId: id });

      return ApiResponse.from({
        code: 200,
        type: 'Success',
        message: `WarehouseUser with ID ${id} successfully deleted`,
      });
    } catch (error) {
      logger.error('Failed to delete role', {
        roleId: id,
        error: error.message
      });
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
    logger.debug('Assigning user role', {
      userId: req.userId,
      warehouseId: warehouseId.id,
      role: req.role
    });

    try {
      // Validate request object
      await validateOrReject(req);

      // Check if the user already has a role in the warehouse
      const existingUsers = await this.warehouseUserRepository.findUsersByWarehouse(warehouseId);
      if (existingUsers.includes(req.userId)) {
        logger.warn('User already has role in warehouse', {
          userId: req.userId,
          warehouseId: warehouseId.id
        });
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
      logger.info('User role assigned successfully', {
        userId: newUserRole.id,
        role: newUserRole.role
      });
      return WarehouseUserRoleResponse.from({
        userId: newUserRole.id,
        role: newUserRole.role,
        assignedAt: newUserRole.createdAt,
      });
    } catch (error) {
      logger.error('Failed to assign user role', {
        userId: req.userId,
        warehouseId: warehouseId.id,
        error: error.message
      });
      return ApiResponse.from({
        code: 500,
        type: 'Internal Server Error',
        message: `Error assigning role to user: ${error}`,
      });
    }
  }

  public async removeUserRole(req: RemoveUserRoleRequest): Promise<ApiResponse> {
    logger.debug('Removing user role', {
      userId: req.userId,
      role: req.role
    });

    try {
      // Validate request object
      await validateOrReject(req);

      // Find the user-role association in the warehouse
      const usersWithRole = await this.warehouseUserRepository.findUsersByRoleAndWarehouse(
        req.role,
        { id: req.userId } as Warehouse
      );

      if (usersWithRole.length === 0) {
        logger.warn('User role not found in warehouse', {
          userId: req.userId,
          role: req.role
        });
        return ApiResponse.from({
          code: 404,
          type: 'Not Found',
          message: `User with ID ${req.userId} and role ${req.role} not found in the specified warehouse`,
        });
      }

      // Perform soft delete of the user role
      await this.warehouseUserRepository.softDelete(req.userId);

      logger.info('User role removed successfully', {
        userId: req.userId,
        role: req.role
      });

      return ApiResponse.from({
        code: 200,
        type: 'Success',
        message: `Role ${req.role} successfully removed from user with ID ${req.userId}`,
      });
    } catch (error) {
      logger.error('Failed to remove user role', {
        userId: req.userId,
        role: req.role,
        error: error.message
      });
      return ApiResponse.from({
        code: 500,
        type: 'Internal Server Error',
        message: `Error removing role from user: ${error}`,
      });
    }
  }
}
