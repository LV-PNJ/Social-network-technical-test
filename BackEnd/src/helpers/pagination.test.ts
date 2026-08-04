import { describe, it, expect } from 'vitest';
import { parsePagination } from './pagination';

describe('parsePagination', () => {
  it('defaults to page 1 size 10', () => {
    expect(parsePagination({ query: {} })).toEqual({ page: 1, size: 10, skip: 0 });
  });

  it('parses page and size', () => {
    expect(parsePagination({ query: { page: '2', size: '5' } })).toEqual({
      page: 2,
      size: 5,
      skip: 5,
    });
  });

  it('clamps size to 50 and page to >= 1', () => {
    expect(parsePagination({ query: { page: '0', size: '999' } })).toEqual({
      page: 1,
      size: 50,
      skip: 0,
    });
  });
});
