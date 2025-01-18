import { plainToClass } from "class-transformer";

class BaseResponse {
  static from<T extends BaseResponse>(this: new () => T, obj: Partial<T>): T {
    return plainToClass(this, obj);
  }
}


export class ApiResponse extends BaseResponse {
  code: number;
  type: string;
  message: string;
}
