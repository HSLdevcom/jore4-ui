import produce from 'immer';
import range from 'lodash/range';
import qs from 'qs';
import { useHistory } from 'react-router';
import { useUrlQuery } from './useUrlQuery';

const ADDITIONAL_BUTTON_AMOUNT = 2;

export const usePagination = (): {
  currentPage: number;
  getPaginatedData: <T>(data: Array<T>, itemsPerPage: number) => Array<T>;
  setPage: (page: number) => void;
  getRenderedPageNumber: (page: number) => string;
  getDisplayedPageNumberList: (
    currentPage: number,
    amountOfNeighbours: number,
    totalPages: number,
  ) => number[];
} => {
  const history = useHistory();
  const { queryParams } = useUrlQuery();
  const initialPage = parseInt(queryParams?.page as string, 10) || 1;

  const getPaginatedData = <T>(data: Array<T>, itemsPerPage: number) => {
    const currentPage = initialPage;

    return data?.slice(
      currentPage * itemsPerPage - itemsPerPage,
      currentPage * itemsPerPage,
    );
  };

  /** Sets the given page to query parameters */
  const setPage = (page: number) => {
    const updatedUrlQuery = produce(queryParams, (draft) => {
      draft.page = page.toString();
    });
    history.push({
      search: qs.stringify(updatedUrlQuery),
    });
  };

  /** Determines the starting and ending index to slice the shown page numbers
   *
   * @param amountOfNeighbours determines how many page numbers are rendered on
   * each side of the current page before dots. For example, if amountOfNeighbours = 2
   * And current page is 7 then we render ... 5 6 7 8 9 ... If amountOfNeighbours = 1
   * we render ... 6 7 8 ...
   */
  const getSliceIndexes = (
    currentPage: number,
    amountOfNeighbours: number,
    totalPages: number,
  ) => {
    const currentPageIsNearStart =
      currentPage <= amountOfNeighbours + ADDITIONAL_BUTTON_AMOUNT;
    const currentPageIsNearEnd =
      currentPage + amountOfNeighbours + ADDITIONAL_BUTTON_AMOUNT >= totalPages;

    // If current page is near start or near end, we render more page numbers to
    // keep the same amount of elements rendered all the time.
    if (currentPageIsNearStart) {
      return {
        startIndex: 0,
        endIndex: amountOfNeighbours * 2 + ADDITIONAL_BUTTON_AMOUNT + 1,
      };
    }
    if (currentPageIsNearEnd) {
      const startIndex =
        totalPages - amountOfNeighbours * 2 - ADDITIONAL_BUTTON_AMOUNT - 1;
      return {
        // If start index would be negative, set 0 so the slice will work properly
        startIndex: startIndex < 0 ? 0 : startIndex,
        endIndex: totalPages,
      };
    }
    return {
      startIndex: currentPage - amountOfNeighbours - 1,
      endIndex: currentPage + amountOfNeighbours,
    };
  };

  const getDisplayedPageNumberList = (
    currentPage: number,
    amountOfNeighbours: number,
    totalPages: number,
  ) => {
    const { startIndex, endIndex } = getSliceIndexes(
      currentPage,
      amountOfNeighbours,
      totalPages,
    );

    const pageNumbers = range(1, totalPages + 1);

    return pageNumbers.slice(startIndex, endIndex);
  };

  /** Adds zero in front of 1-9 page numbers */
  const getRenderedPageNumber = (page: number) =>
    page < 10 ? `0${page}` : page.toString();

  return {
    currentPage: initialPage,
    getPaginatedData,
    setPage,
    getRenderedPageNumber,
    getDisplayedPageNumberList,
  };
};
