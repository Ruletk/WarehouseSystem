import { Router, Request, Response } from 'express';
import { ItemService } from '../services/itemService';
import { CreateItemRequest, UpdateItemRequest } from '../dto/request';
import { validationMiddleware } from '../middleware/validationMiddleware';

export class StockRouter {
  private itemService: ItemService;

  constructor(itemService: ItemService) {
    this.itemService = itemService;
  }

  registerRoutes(router: Router) {
    // Получить все товары в складе
    router.get('/warehouse/:warehouse_id', this.getStocksByWarehouse);

    // Создать новый товар
    router.post(
      '/warehouse/:warehouse_id',
      validationMiddleware(CreateItemRequest), // Middleware для валидации входных данных
      this.createStock
    );

    // Получить товар по ID
    router.get('/warehouse/:warehouse_id/stock/:stock_id', this.getStockById);

    // Обновить существующий товар
    router.put(
      '/warehouse/:warehouse_id/stock/:stock_id',
      validationMiddleware(UpdateItemRequest), // Middleware для валидации входных данных
      this.updateStock
    );

    // Удалить товар по ID
    router.delete('/warehouse/:warehouse_id/stock/:stock_id', this.deleteStock);
  }

  getStocksByWarehouse = async (req: Request, res: Response) => {
    try {
      const warehouse_id = req.params.warehouse_id;
      const items = await this.itemService.getItemsByWarehouse(warehouse_id);
      res.status(200).send(items);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  createStock = async (req: Request, res: Response) => {
    try {
      const itemRequest = req.body; // Данные валидированы middleware
      itemRequest.warehouse_id = req.params.warehouse_id;

      const item = await this.itemService.createItem(itemRequest);
      res.status(201).send(item);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  getStockById = async (req: Request, res: Response) => {
    try {
      const warehouse_id = req.params.warehouse_id;
      const item_id = req.params.stock_id;

      const item = await this.itemService.getItemById(warehouse_id, item_id);
      res.status(200).send(item);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  updateStock = async (req: Request, res: Response) => {
    try {
      const item_id = req.params.stock_id;
      const itemRequest = req.body; // Данные валидированы middleware

      const item = await this.itemService.updateItem(item_id, itemRequest);
      res.status(200).send(item);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  deleteStock = async (req: Request, res: Response) => {
    try {
      const item_id = req.params.stock_id;

      const response = await this.itemService.deleteItem(item_id);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
}
