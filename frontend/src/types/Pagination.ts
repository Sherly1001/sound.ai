export interface PageQuery {
  limit?: number;
  page?: number;
}

export interface TimeQuery {
  afterAt?: Date;
  beforeAt?: Date;
}

export interface OrderQuery {
  orderBy?: string;
  orderASC?: boolean;
}

export class Pagination<T> {
  items: T[];
  count: number;
  total: number;
  totalPages: number;
  page: number;
  hasNext: boolean;
  hasPrev: boolean;

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
