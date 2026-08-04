import { Request } from 'express';

export type Pagination = {
  page: number;
  size: number;
  skip: number;
};

export function parsePagination(req: Pick<Request, 'query'>): Pagination {
  const page = Math.max(1, Number(req.query.page) || 1);
  const size = Math.min(50, Math.max(1, Number(req.query.size) || 10));
  return { page, size, skip: (page - 1) * size };
}
