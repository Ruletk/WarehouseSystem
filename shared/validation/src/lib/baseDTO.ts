import { Exclude, Expose, instanceToPlain, plainToClass } from 'class-transformer';

export class BaseResponse {
  static from<T extends BaseResponse>(this: new () => T, obj: Partial<T>): T {
    return plainToClass(this, obj);
  }

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}

export class ApiResponse extends BaseResponse {
  @Expose()
  code!: number;

  @Expose()
  type!: string;

  @Expose()
  message!: string;

  @Exclude({ toPlainOnly: true })
  data?: Record<string, unknown>;
}
