import {TimeInfo, Location} from "./base";

export class Warehouse {
  id: number;
  name: string;
  address: string;
  location: Location;
  timeInfo: TimeInfo;
}

export class WarehouseList {
  data: Warehouse[];
}
