import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';

export class BaseResult<T> {
  @ApiProperty()
  data?: T;

  @ApiProperty({ type: 'string' })
  error?: Error | string;

  @ApiProperty()
  code: number;

  constructor(data?: T | Error, code: number = 200) {
    if (data instanceof Error) {
      this.error = data;
    } else {
      this.data = data;
    }

    if (data instanceof HttpException) {
      this.code = data.getStatus();
    } else {
      this.code = code;
    }
  }

  toResponse(res: Response) {
    return res.status(this.code).json(this);
  }

  toJSON() {
    const obj = { ...this };
    if (obj.error) {
      obj.error = obj.error.toString();
    }
    return instanceToPlain(obj);
  }
}

export class Pagination<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;

  @ApiProperty()
  totalPages: number;

  constructor(items: T[], total: number, limit: number, page: number) {
    if (limit < 1) limit = 10;
    this.totalPages = Math.ceil(total / limit);

    this.items = items;
    this.count = items.length;
    this.total = total;
    this.page = page > 0 ? +page : 1;
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}
