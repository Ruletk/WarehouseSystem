import request from 'supertest';
import express from 'express';
import { WarehouseAPI } from '../src/routes/warehouseRouter';
import { WarehouseService } from '../src/services/warehouseService';
import { WarehouseTagService } from '../src/services/warehouseTagService';
import { WarehouseUserService } from '../src/services/warehouseUserService';
import { WarehouseRepository } from '../src/repositories/warehouseRepository';
import { WarehouseTagRepository } from '../src/repositories/warehouseTagRepository';
import { WarehouseUserRepository } from '../src/repositories/warehouseUserRepository';
import { AppDataSource, flushDB } from './mock/db';
import { CreateWarehouseRequest } from '../src/dto/request';
import { WarehouseResponse } from '../src/dto/response';

describe('WarehouseAPI Integration Tests', () => {
  let app: express.Express;
  let warehouseService: WarehouseService;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize(); // Инициализация только если соединение не установлено
    }

    // Инициализация репозиториев
    const warehouseRepository = new WarehouseRepository(AppDataSource);
    const warehouseTagRepository = new WarehouseTagRepository(AppDataSource);
    const warehouseUserRepository = new WarehouseUserRepository(AppDataSource);

    // Инициализация сервисов
    warehouseService = new WarehouseService(warehouseRepository);
    const warehouseTagService = new WarehouseTagService(warehouseTagRepository);
    const warehouseUserService = new WarehouseUserService(
      warehouseUserRepository
    );

    // Создание экземпляра WarehouseAPI
    const warehouseAPI = new WarehouseAPI(
      warehouseService,
      warehouseTagService,
      warehouseUserService
    );

    // Настройка Express приложения
    app = express();
    app.use(express.json());
    warehouseAPI.registerRoutes(app);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    //
  });

  afterEach(async () => {
    await flushDB();
  });

  describe('POST /warehouse/', () => {
    it('should create a warehouse', async () => {
      const warehouseData = {
        name: 'Test Warehouses',
        latitude: 40,
        longitude: -74,
        address: 'Test Location',
      };

      const response = await request(app) // Используем app, а не server
        .post('/')
        .send(warehouseData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(warehouseData.name);
      expect(response.body.latitude).toBe(warehouseData.latitude);
      expect(response.body.longitude).toBe(warehouseData.longitude);
      expect(response.body.address).toBe(warehouseData.address);
    });
  });

  describe('DELETE /warehouse/:id', () => {
    it('should delete a warehouse', async () => {
      const warehouse = await warehouseService.createWarehouse({
        name: 'Test Warehouses',
        latitude: 40,
        longitude: -74,
        address: 'Test Location',
      } as CreateWarehouseRequest) as WarehouseResponse;

      const response = await request(app).delete(`/${warehouse.id}`).expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Warehouse deleted successfully'
      );
    });
  });
});
