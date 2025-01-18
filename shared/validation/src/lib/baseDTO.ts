import { Exclude, Expose, plainToClass } from 'class-transformer';

class BaseResponse {
  static from<T extends BaseResponse>(this: new () => T, obj: Partial<T>): T {
    return plainToClass(this, obj);
  }
}

export class ApiResponse extends BaseResponse {
  @Expose()
  code!: number;

  @Expose()
  type!: string;

  @Expose()
  message!: string;

  @Exclude()
  data?: Record<string, unknown>;
}
