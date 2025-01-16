import { Router } from 'express';
import { ItemService } from '../services/itemService';
import { ItemRequest } from '../dto/request';

export class StockRouter {
  private itemService: ItemService;

  constructor(stockService: ItemService) {
    this.itemService = stockService;
  }

  registerRoutes(router: Router) {
    router.get('/warehouse/:warehouse_id', this.getStocksByWarehouse);
    router.post('/warehouse/:warehouse_id', this.createStock);
    router.get('/warehouse/:warehouse_id/stock/:stock_id', this.getStockById);
    router.put('/warehouse/:warehouse_id/stock/:stock_id', this.updateStock);
    router.delete('/warehouse/:warehouse_id/stock/:stock_id', this.deleteStock);
  }

  async getStocksByWarehouse(req, res) {
    const warehouse_id = req.params.warehouse_id;
    const items = await this.itemService.getItemsByWarehouse(warehouse_id);
    res.status(200).send(items);
  }

  async createStock(req, res) {
    const itemRequest = new ItemRequest(req.body);
    itemRequest.warehouse_id = req.params.warehouse_id;

    const item = await this.itemService.createItem(itemRequest);
    res.status(201).send(item);
  }

  async getStockById(req, res) {
    const warehouse_id = req.params.warehouse_id;
    const item_id = req.params.stock_id;
    const item = await this.itemService.getItemById(warehouse_id, item_id);
    res.status(200).send(item);
  }

  async updateStock(req, res) {
    const item_id = req.params.stock_id;
    const itemRequest = new ItemRequest(req.body);
    const item = await this.itemService.updateItem(item_id, itemRequest);
    res.status(200).send(item);
  }

  async deleteStock(req, res) {
    const item_id = req.params.stock_id;
    const resp = await this.itemService.deleteItem(item_id);
    res.status(200).send(resp);
  }
}
