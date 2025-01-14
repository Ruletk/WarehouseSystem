import {BaseDTO, Location} from "./base";

export class WarehouseCreation extends BaseDTO {
  name: string;
  address: string;
  location: Location;
}

export class WarehouseUpdate extends BaseDTO {
  name?: string;
  address?: string;
  location?: Location;
}
