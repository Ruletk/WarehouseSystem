import {WarehouseRepository} from "../repositories/warehouseRepository";
import {WarehouseResponse, WarehouseList} from "../dto/response";
import {WarehouseCreation, WarehouseUpdate} from "../dto/request";
import {Warehouse} from "../models/warehouse";

export class WarehouseService {
  private warehouseRepository: WarehouseRepository;

  constructor(warehouseRepository: WarehouseRepository) {
    this.warehouseRepository = warehouseRepository;
  }

  async getAll(): Promise<WarehouseList> {
    const warehouses = await this.warehouseRepository.findAll();

    return {
      data: warehouses.map((w) => WarehouseResponse.fromPlain(w))
    };
  }

  async warehouseCreate(warehouse: WarehouseCreation): Promise<WarehouseResponse> {
    const savedWarehouse = await this.warehouseRepository.create(warehouse.name, warehouse.location.latitude, warehouse.location.longitude, warehouse.address);

    return WarehouseResponse.fromPlain(savedWarehouse);
  }

  async getById(id: number): Promise<WarehouseResponse> {
    const warehouse = await this.warehouseRepository.findById(id);

    return WarehouseResponse.fromPlain(warehouse);
  }

  async update(id: number, warehouse: WarehouseUpdate): Promise<WarehouseResponse> {
    const model = new Warehouse();
    if (warehouse.name !== undefined)
      model.name = warehouse.name;
    if (warehouse.location !== undefined){
      model.latitude = warehouse.location.latitude;
      model.longitude = warehouse.location.longitude;
    }
    if (warehouse.address !== undefined)
      model.address = warehouse.address;

    await this.warehouseRepository.update(model);

    return WarehouseResponse.fromPlain(model);
  }

  async delete(id: number): Promise<void> {
    await this.warehouseRepository.softDelete(id);
  }
}
