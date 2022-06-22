import { renderHook } from '@testing-library/react-hooks';
import { usePagination } from './usePagination';
import { useUrlQuery } from './useUrlQuery';

jest.mock('./useUrlQuery', () => ({
  useUrlQuery: jest.fn().mockReturnValue({}),
}));
const mockHistory = {
  push: jest.fn(),
};

jest.mock('react-router', () => ({
  useHistory: () => mockHistory,
}));

const urlQueryMock = useUrlQuery as jest.Mock;
const hookForNames = renderHook(usePagination);

describe(`${hookForNames.result.current.getRenderedPageNumber.name}`, () => {
  const { result } = renderHook(usePagination);

  test('Should add 0 in front of 1', () => {
    const output = result.current.getRenderedPageNumber(1);
    expect(output).toBe('01');
  });

  test('Should add 0 in front of 9', () => {
    const output = result.current.getRenderedPageNumber(9);
    expect(output).toBe('09');
  });

  test('Should not add 0 in front of 10', () => {
    const output = result.current.getRenderedPageNumber(10);
    expect(output).toBe('10');
  });
});

describe(`${hookForNames.result.current.getPaginatedData}`, () => {
  test('should show paginated data for page 1', () => {
    const data = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;
    urlQueryMock.mockReturnValueOnce({ page: 1 });

    const { result } = renderHook(usePagination);

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([1, 2]);
  });

  test('should show paginated data for page 2', () => {
    urlQueryMock.mockReturnValueOnce({ page: 2 });
    const { result } = renderHook(usePagination);
    const data = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([3, 4]);
  });

  test('should show paginated data for page 3', () => {
    urlQueryMock.mockReturnValueOnce({ page: 3 });
    const { result } = renderHook(usePagination);
    const data = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([5]);
  });

  test('should not crash with empty data', () => {
    urlQueryMock.mockReturnValueOnce({ page: 1 });
    const { result } = renderHook(usePagination);
    const data: number[] = [];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([]);
  });

  test('should paginate to page 1 if page query parameter is not given', () => {
    urlQueryMock.mockReturnValueOnce({});
    const { result } = renderHook(usePagination);
    const data: number[] = [1, 2, 3, 4, 5];
    const itemsPerPage = 2;

    const output = result.current.getPaginatedData(data, itemsPerPage);

    expect(output).toEqual([1, 2]);
  });
});

describe(`${hookForNames.result.current.setPage.name}`, () => {
  test('should call history with page=5', () => {
    const { result } = renderHook(usePagination);

    result.current.setPage(5);

    expect(mockHistory.push).toBeCalledWith({ search: 'page=5' });
  });

  test('should overwrite existing page query parameter', () => {
    urlQueryMock.mockReturnValueOnce({ page: '5' });
    const { result } = renderHook(usePagination);
    result.current.setPage(10);

    expect(mockHistory.push).toBeCalledWith({
      search: 'page=10',
    });
  });

  test('should not remove existing query parameters', () => {
    urlQueryMock.mockReturnValueOnce({ name: 'TestName', line: 'TestLine' });
    const { result } = renderHook(usePagination);
    result.current.setPage(10);

    expect(mockHistory.push).toBeCalledWith({
      search: 'name=TestName&line=TestLine&page=10',
    });
  });
});

describe(`${hookForNames.result.current.getDisplayedPageNumberList.name}`, () => {
  test('should return correct page numbers, amountOfNeighbours=2', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 10;
    const amountOfNeighbours = 2;
    const totalPages = 20;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([8, 9, 10, 11, 12]);
  });

  test('should return correct page numbers, amountOfNeighbours=1', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 10;
    const amountOfNeighbours = 1;
    const totalPages = 20;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([9, 10, 11]);
  });

  test('should return 2 more page numbers, when current page is near start', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 1;
    const amountOfNeighbours = 2;
    const totalPages = 20;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should return 2 more page numbers, when current page is near end', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 20;
    const amountOfNeighbours = 2;
    const totalPages = 20;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([14, 15, 16, 17, 18, 19, 20]);
  });

  test('should return all page numbers, current page on start', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 3;
    const amountOfNeighbours = 2;
    const totalPages = 7;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should return all page numbers, current page middle', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 4;
    const amountOfNeighbours = 2;
    const totalPages = 7;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should return all page numbers, current page last page', () => {
    const { result } = renderHook(usePagination);
    const currentPage = 7;
    const amountOfNeighbours = 2;
    const totalPages = 7;

    const pageNumbers = result.current.getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe(`${hookForNames.result.current.currentPage}`, () => {
  test('should default to 1 (no query parameter)', () => {
    const { result } = renderHook(usePagination);
    expect(result.current.currentPage).toBe(1);
  });

  test('should return correct currentPage', () => {
    urlQueryMock.mockReturnValueOnce({ page: 3 });
    const { result } = renderHook(usePagination);
    expect(result.current.currentPage).toBe(3);
  });
});
