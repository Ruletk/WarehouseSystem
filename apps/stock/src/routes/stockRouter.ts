import { Router, Request, Response } from 'express';
import { ItemService } from '../services/itemService';
import { CreateItemRequest, UpdateItemRequest } from '../dto/request';
import { validateRequest } from '@warehouse/validation';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('stockRouter');

export class StockRouter {
  private itemService: ItemService;

  constructor(itemService: ItemService) {
    logger.info('Creating StockRouter instance');
    this.itemService = itemService;
  }

  registerRoutes(router: Router) {
    logger.info('Registering stock routes');

    router.get('/warehouse/:warehouse_id', this.getStocksByWarehouse);
    router.post(
      '/warehouse/:warehouse_id',
      validateRequest(CreateItemRequest),
      this.createStock
    );
    router.get('/warehouse/:warehouse_id/stock/:stock_id', this.getStockById);
    router.put(
      '/warehouse/:warehouse_id/stock/:stock_id',
      validateRequest(UpdateItemRequest),
      this.updateStock
    );
    router.delete('/warehouse/:warehouse_id/stock/:stock_id', this.deleteStock);

    logger.debug('Stock routes registered', {
      routes: [
        'GET /warehouse/:warehouse_id',
        'POST /warehouse/:warehouse_id',
        'GET /warehouse/:warehouse_id/stock/:stock_id',
        'PUT /warehouse/:warehouse_id/stock/:stock_id',
        'DELETE /warehouse/:warehouse_id/stock/:stock_id'
      ]
    });
  }

  getStocksByWarehouse = async (req: Request, res: Response) => {
    const warehouse_id = parseInt(req.params.warehouse_id, 10);
    logger.debug('Get stocks by warehouse request', { warehouse_id });

    try {
      const items = await this.itemService.getItemsByWarehouse(warehouse_id);
      logger.info('Retrieved warehouse stocks', {
        warehouse_id,
        itemCount: items.length
      });
      res.status(200).send(items);
    } catch (error) {
      logger.error('Failed to get warehouse stocks', {
        warehouse_id,
        error: error.message
      });
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  createStock = async (req: Request, res: Response) => {
    const warehouse_id = req.params.warehouse_id;
    logger.debug('Create stock request', {
      warehouse_id,
      itemName: req.body.name
    });

    try {
      const itemRequest = req.body;
      itemRequest.warehouse_id = warehouse_id;
      const item = await this.itemService.createItem(itemRequest);

      logger.info('Stock item created', {
        warehouse_id,
        item_id: item.item_id
      });
      res.status(201).send(item);
    } catch (error) {
      logger.error('Failed to create stock item', {
        warehouse_id,
        error: error.message
      });
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  getStockById = async (req: Request, res: Response) => {
    const warehouse_id = parseInt(req.params.warehouse_id, 10);
    const item_id = parseInt(req.params.stock_id, 10);

    logger.debug('Get stock by ID request', {
      warehouse_id,
      item_id
    });

    try {
      const item = await this.itemService.getItemById(warehouse_id, item_id);
      logger.info('Retrieved stock item', {
        warehouse_id,
        item_id,
        found: !!item
      });
      res.status(200).send(item);
    } catch (error) {
      logger.error('Failed to get stock item', {
        warehouse_id,
        item_id,
        error: error.message
      });
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  updateStock = async (req: Request, res: Response) => {
    const item_id = parseInt(req.params.stock_id, 10);
    logger.debug('Update stock request', {
      item_id,
      updates: Object.keys(req.body)
    });

    try {
      const itemRequest = req.body;
      const item = await this.itemService.updateItem(item_id, itemRequest);

      logger.info('Stock item updated', {
        item_id,
        updated: !!item
      });
      res.status(200).send(item);
    } catch (error) {
      logger.error('Failed to update stock item', {
        item_id,
        error: error.message
      });
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  deleteStock = async (req: Request, res: Response) => {
    const item_id = parseInt(req.params.stock_id, 10);
    logger.warn('Delete stock request', { item_id });

    try {
      const response = await this.itemService.deleteItem(item_id);
      logger.info('Stock item deleted', {
        item_id,
        success: true
      });
      res.status(200).send(response);
    } catch (error) {
      logger.error('Failed to delete stock item', {
        item_id,
        error: error.message
      });
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
}
