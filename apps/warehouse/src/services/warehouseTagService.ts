import {
  CreateTagRequest,
  UpdateTagRequest,
} from '../dto/request';
import {
  WarehouseTagListResponse,
  WarehouseTagResponse,
} from '../dto/response';
import { ApiResponse } from '@warehouse/validation';
import {WarehouseTagRepository} from "../repositories/warehouseTagRepository";
import {Warehouse} from "../models/warehouse";

export class WarehouseTagService{
  private warehouseTagRepository: WarehouseTagRepository;

  constructor(warehouseTagRepository: WarehouseTagRepository){
    this.warehouseTagRepository = warehouseTagRepository;
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
}
