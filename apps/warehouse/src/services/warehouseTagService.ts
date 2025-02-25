import { CreateTagRequest, UpdateTagRequest } from '../dto/request';
import { WarehouseTagListResponse, WarehouseTagResponse } from '../dto/response';
import { ApiResponse } from '@warehouse/validation';
import { WarehouseTagRepository } from "../repositories/warehouseTagRepository";
import { Warehouse } from "../models/warehouse";
import { getLogger } from '@warehouse/logging';

const logger = getLogger('warehouseTagService');

export class WarehouseTagService {
  private warehouseTagRepository: WarehouseTagRepository;

  constructor(warehouseTagRepository: WarehouseTagRepository) {
    logger.info('Creating WarehouseTagService instance');
    this.warehouseTagRepository = warehouseTagRepository;
  }

  public async getAllTags(): Promise<WarehouseTagListResponse | ApiResponse> {
    logger.debug('Fetching all warehouse tags');

    try {
      const warehouses = await this.warehouseTagRepository.findAll();

      if (!warehouses || warehouses.length === 0) {
        logger.info('No warehouse tags found');
        return ApiResponse.from({
          message: 'No warehouses found for the provided tags.',
        });
      }

      logger.info('Retrieved all warehouse tags', {
        count: warehouses.length
      });

      const warehouseTagResponses = warehouses.map((warehouse) =>
        WarehouseTagResponse.from({
          tagId: warehouse.tagId,
          tag: warehouse.tag,
          createdAt: warehouse.createdAt,
          updatedAt: warehouse.updatedAt,
        })
      );

      return WarehouseTagListResponse.from({ tags: warehouseTagResponses });
    } catch (error) {
      logger.error('Failed to fetch warehouse tags', {
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async createTag(
    warehouseId: Warehouse,
    req: CreateTagRequest
  ): Promise<WarehouseTagResponse | ApiResponse> {
    logger.debug('Creating new warehouse tag', {
      warehouseId: warehouseId.id,
      tag: req.tag
    });

    try {
      const warehouse = await this.warehouseTagRepository.create(
        req.tag,
        warehouseId
      );

      if (!warehouse) {
        logger.warn('Failed to create warehouse tag', {
          warehouseId: warehouseId.id,
          tag: req.tag
        });
        return ApiResponse.from({
          message: 'Failed to create warehouse with the provided tag.',
        });
      }

      logger.info('Warehouse tag created successfully', {
        tagId: warehouse.tagId,
        warehouseId: warehouseId.id
      });

      return WarehouseTagResponse.from({
        tagId: warehouse.tagId,
        tag: req.tag,
        createdAt: warehouse.createdAt,
        updatedAt: warehouse.updatedAt
      });
    } catch (error) {
      logger.error('Error creating warehouse tag', {
        warehouseId: warehouseId.id,
        tag: req.tag,
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async updateTagById(
    req: UpdateTagRequest
  ): Promise<WarehouseTagResponse | ApiResponse> {
    logger.debug('Updating warehouse tag', { tagId: req.id });

    try {
      const existingTag = await this.warehouseTagRepository.findById(req.id);

      if (!existingTag) {
        logger.warn('Tag not found for update', { tagId: req.id });
        return ApiResponse.from({
          message: `Tag with id ${req.id} not found`,
        });
      }

      await this.warehouseTagRepository.update({
        tagId: req.id,
        tag: existingTag.tag,
        createdAt: existingTag.createdAt,
        updatedAt: existingTag.updatedAt,
      });

      logger.info('Tag updated successfully', { tagId: req.id });

      return WarehouseTagResponse.from({
        tagId: req.id,
        tag: existingTag.tag,
        createdAt: existingTag.createdAt,
        updatedAt: existingTag.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to update tag', {
        tagId: req.id,
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  public async deleteTagById(id: number): Promise<ApiResponse> {
    logger.debug('Deleting warehouse tag', { tagId: id });

    try {
      const existingTag = await this.warehouseTagRepository.findById(id);

      if (!existingTag) {
        logger.warn('Tag not found for deletion', { tagId: id });
        return ApiResponse.from({
          message: `Tag with id ${id} not found`,
        });
      }

      await this.warehouseTagRepository.softDelete(id);

      logger.info('Tag deleted successfully', { tagId: id });

      return ApiResponse.from({
        message: 'Tag deleted successfully',
      });
    } catch (error) {
      logger.error('Failed to delete tag', {
        tagId: id,
        error: error.message
      });
      return ApiResponse.from({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
}
