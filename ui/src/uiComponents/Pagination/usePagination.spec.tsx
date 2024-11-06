import { renderHook } from '@testing-library/react';
import { useUrlQuery } from '../../hooks';
import { usePagination } from './usePagination';

jest.mock('../../hooks/urlQuery/useUrlQuery', () => ({
  useUrlQuery: jest.fn().mockReturnValue({}),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const urlQueryMock = useUrlQuery as jest.Mock;

describe('Pagination - usePagination - getPaginatedData', () => {
  test('should show paginated data for page 1', () => {
    const data = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 1 } });

    const { result } = renderHook(usePagination);

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([1, 2]);
  });

  test('should show paginated data for page 2', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 2 } });
    const { result } = renderHook(usePagination);
    const data = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([3, 4]);
  });

  test('should show paginated data for page 3', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 3 } });
    const { result } = renderHook(usePagination);
    const data = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([5]);
  });

  test('should not crash with empty data', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 1 } });
    const { result } = renderHook(usePagination);
    const data: number[] = [];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([]);
  });

  test('should paginate to page 1 if page query parameter is not given', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: {} });
    const { result } = renderHook(usePagination);
    const data: number[] = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([1, 2]);
  });
});

describe('Pagination - usePagination - setPage', () => {
  test('should call history with page=5', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: {} });
    const { result } = renderHook(usePagination);

    result.current.setPage(5);

    expect(mockNavigate).toHaveBeenCalledWith({ search: 'page=5' });
  });

  test('should overwrite existing page query parameter', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: '5' } });
    const { result } = renderHook(usePagination);
    result.current.setPage(10);

    expect(mockNavigate).toHaveBeenCalledWith({
      search: 'page=10',
    });
  });

  test('should not remove existing query parameters', () => {
    urlQueryMock.mockReturnValueOnce({
      queryParams: { name: 'TestName', line: 'TestLine' },
    });
    const { result } = renderHook(usePagination);
    result.current.setPage(10);

    expect(mockNavigate).toHaveBeenCalledWith({
      search: 'name=TestName&line=TestLine&page=10',
    });
  });
});

describe('Pagination - usePagination - currentPage', () => {
  test('should default to 1 (no query parameter)', () => {
    const { result } = renderHook(usePagination);
    expect(result.current.currentPage).toBe(1);
  });

  test('should return correct currentPage', () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 3 } });
    const { result } = renderHook(usePagination);
    expect(result.current.currentPage).toBe(3);
  });
});
