import { DataSource, Repository } from 'typeorm';
import { Warehouse } from '../models/warehouse';
import { WarehouseTag } from '../models/warehouseTag';
import { WarehouseUser } from '../models/warehouseUser';

export class WarehouseRepository {
  private appDataSource: DataSource;
  private repository: Repository<Warehouse>;

  constructor(appDataSource: DataSource) {
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(Warehouse);
  }

  async create(
    name: string,
    latitude: number,
    longitude: number,
    address: string
  ): Promise<Warehouse> {
    const warehouse = this.repository.create({
      name,
      latitude,
      longitude,
      address,
    });

    return await this.repository.save(warehouse);
  }

  async createTag(tag: string): Promise<WarehouseTag> {
    const newTag = this.appDataSource.getRepository(WarehouseTag).create({
      tag,
    });

    return this.appDataSource.getRepository(WarehouseTag).save(newTag);
  }

  async createRole(id: number, name: string): Promise<WarehouseUser> {
    const newRole = this.appDataSource.getRepository(WarehouseUser).create({
      id: id,
      role: name,
    });
    return this.appDataSource.getRepository(WarehouseUser).save(newRole);
  }

  async update(updateData: Partial<Warehouse>): Promise<void> {
    await this.repository.update(updateData.id, updateData);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.insert({ id, deletedAt: new Date() });
  }

  async hardDelete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findById(id: number): Promise<Warehouse | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Warehouse | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async findByTagName(tagName: string): Promise<Warehouse[]> {
    return await this.repository
      .createQueryBuilder('warehouse')
      .innerJoin('warehouse.tags', 'tag')
      .where('tag.name = :tagName', { tagName })
      .getMany();
  }

  async findWarehousesByUserId(userId: number): Promise<Warehouse[]> {
    return await this.repository
      .createQueryBuilder('warehouse')
      .innerJoin('warehouse.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findAll(): Promise<Warehouse[]> {
    return await this.repository.find();
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
