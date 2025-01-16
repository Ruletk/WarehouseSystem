import { Router } from 'express';
import { ItemService } from '../services/itemService';
import { ItemRequest } from '../dto/request';

export class StockRouter {
  private itemService: ItemService;

  constructor(itemService: ItemService) {
    this.itemService = itemService;
  }

  registerRoutes(router: Router) {
    router.get('/warehouse/:warehouse_id', this.getStocksByWarehouse);
    router.post('/warehouse/:warehouse_id', this.createStock);
    router.get('/warehouse/:warehouse_id/stock/:stock_id', this.getStockById);
    router.put('/warehouse/:warehouse_id/stock/:stock_id', this.updateStock);
    router.delete('/warehouse/:warehouse_id/stock/:stock_id', this.deleteStock);
  }

  getStocksByWarehouse = async (req, res) => {
    const warehouse_id = req.params.warehouse_id;
    const items = await this.itemService.getItemsByWarehouse(warehouse_id);
    res.status(200).send(items);
  };

  createStock = async (req, res) => {
    const itemRequest = new ItemRequest(req.body);
    itemRequest.warehouse_id = req.params.warehouse_id;
    console.log(itemRequest);

    const item = await this.itemService.createItem(itemRequest);
    res.status(201).send(item);
  };

  getStockById = async (req, res) => {
    const warehouse_id = req.params.warehouse_id;
    const item_id = req.params.stock_id;
    const item = await this.itemService.getItemById(warehouse_id, item_id);
    res.status(200).send(item);
  };

  updateStock = async (req, res) => {
    const item_id = req.params.stock_id;
    const itemRequest = new ItemRequest(req.body);
    console.log(itemRequest);
    const item = await this.itemService.updateItem(item_id, itemRequest);
    res.status(200).send(item);
  };

  deleteStock = async (req, res) =>  {
    const item_id = req.params.stock_id;
    const resp = await this.itemService.deleteItem(item_id);
    res.status(200).send(resp);
  };
}
