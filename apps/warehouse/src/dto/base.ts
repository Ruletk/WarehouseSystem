import {plainToInstance} from "class-transformer";

export class Location {
  latitude: number;
  longitude: number;
}

export class TimeInfo {
  createdAt: Date;
  updatedAt: Date;
}

export class BaseDTO {
  static fromPlain<T extends BaseDTO>(plain: object): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return plainToInstance(this as any, plain);
  }
}
