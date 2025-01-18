import {TimeInfo, Location, BaseDTO} from "./base";

export class WarehouseResponse extends BaseDTO {
  id: number;
  name: string;
  address: string;
  location: Location;
  timeInfo: TimeInfo;
}

export class WarehouseList {
  data: WarehouseResponse[];
}
