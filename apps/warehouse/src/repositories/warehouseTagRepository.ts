import { DataSource, Repository } from "typeorm";
import { WarehouseTag } from "../models/warehouseTag";
import {Warehouse} from "../models/warehouse";



export class WarehouseTagRepository {
  private appDataSource: DataSource
  private repository: Repository<WarehouseTag>

  constructor(appDataSource: DataSource) {
    this.appDataSource = appDataSource
    this.repository = appDataSource.getRepository(WarehouseTag)
  }

  async create(tag: string, warehouse: Warehouse): Promise<WarehouseTag> {
    const warehouseTag = this.repository.create({ tag, warehouse })
    return await this.repository.save(warehouseTag)
  }

  async update(updateData: Partial<WarehouseTag>): Promise<void> {
    await this.repository.update(updateData.tagId, updateData)
  }

  async softDelete(tagId: number): Promise<void> {
    await this.repository.insert({ tagId, deletedAt: new Date() })
  }

  async hardDelete(tagId: number): Promise<void> {
    await this.repository.delete(tagId)
  }

  async findById(tagId: number): Promise<WarehouseTag | null> {
    return await this.repository.findOneBy({ tagId })
  }

  async findByTag(tag: string): Promise<WarehouseTag | null> {
    return await this.repository.findOne({ where: { tag } })
  }

  async findAll(): Promise<WarehouseTag[]> {
    return await this.repository.find()
  }

  async count(): Promise<number> {
    return await this.repository.count()
  }

}
