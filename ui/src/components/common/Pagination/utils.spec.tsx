import { getDisplayedPageNumberList, getRenderedPageNumber } from './utils';

describe('Pagination - Utils - getRenderedPageNumber', () => {
  test('Should add 0 in front of 1', () => {
    const output = getRenderedPageNumber(1);
    expect(output).toBe('01');
  });

  test('Should add 0 in front of 9', () => {
    const output = getRenderedPageNumber(9);
    expect(output).toBe('09');
  });

  test('Should not add 0 in front of 10', () => {
    const output = getRenderedPageNumber(10);
    expect(output).toBe('10');
  });
});

describe('Pagination - Utils - getDisplayedPageNumberList', () => {
  test('should return correct page numbers, amountOfNeighbours=2', () => {
    const currentPage = 10;
    const amountOfNeighbours = 2;
    const totalPages = 20;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([8, 9, 10, 11, 12]);
  });

  test('should return correct page numbers, amountOfNeighbours=1', () => {
    const currentPage = 10;
    const amountOfNeighbours = 1;
    const totalPages = 20;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([9, 10, 11]);
  });

  test('should return 2 more page numbers, when current page is near start', () => {
    const currentPage = 1;
    const amountOfNeighbours = 2;
    const totalPages = 20;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should return 2 more page numbers, when current page is near end', () => {
    const currentPage = 20;
    const amountOfNeighbours = 2;
    const totalPages = 20;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([14, 15, 16, 17, 18, 19, 20]);
  });

  test('should return all page numbers, current page on start', () => {
    const currentPage = 3;
    const amountOfNeighbours = 2;
    const totalPages = 7;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should return all page numbers, current page middle', () => {
    const currentPage = 4;
    const amountOfNeighbours = 2;
    const totalPages = 7;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should return all page numbers, current page last page', () => {
    const currentPage = 7;
    const amountOfNeighbours = 2;
    const totalPages = 7;

    const pageNumbers = getDisplayedPageNumberList(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
