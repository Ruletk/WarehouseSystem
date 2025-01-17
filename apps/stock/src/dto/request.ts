export class ItemRequest {
  constructor(data = null) {
    this.name = data?.name;
    this.description = data?.description;
    this.quantity = data?.quantity;
    this.unit_price = data?.unit_price;
    this.unit_ammount = data?.unit_ammount;
    this.warehouse_id = data?.warehouse_id;
  }

  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  unit_ammount: number;
  warehouse_id: number;
}
