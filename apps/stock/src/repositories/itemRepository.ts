import { DataSource, Repository } from 'typeorm';
import { Item } from '../models/item';

export class ItemRepository {
  private appDataSource: DataSource;
  private repository: Repository<Item>;

  constructor(appDataSource: DataSource) {
    this.appDataSource = appDataSource;
    this.repository = appDataSource.getRepository(Item);
  }

  async create(
    warehouse_id: number,
    quantity: number,
    unit_price: number,
    unit_ammount: number,
    name: string,
    description: string
  ): Promise<Item> {
    const auth = this.repository.create({ warehouse_id, quantity, unit_price, unit_ammount, name, description, created_at: new Date(), updated_at: new Date() });
    return await this.repository.save(auth);
  }

  async update(updateData: Partial<Item>): Promise<void> {
    await this.repository.update(updateData.item_id, updateData);
  }

  async softDelete(item_id: number): Promise<void> {
    await this.repository.insert({ item_id, deleted_at: new Date() });
  }

  async hardDelete(item_id: number): Promise<void> {
    await this.repository.delete({ item_id });
  }

  async findById(item_id: number): Promise<Item | null> {
    return await this.repository.findOneBy({ item_id });
  }

  async findByName(name: string): Promise<Item[]> {
    return await this.repository.createQueryBuilder("item")
      .where("item.name ILIKE :name", { name: `%${name}%` })
      .getMany();
  }

  // TODO: Implement sorting, filtering, and pagination

  async findAll(): Promise<Item[]> {
    return await this.repository.find();
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
