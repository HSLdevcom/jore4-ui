import { produce } from 'immer';
import qs from 'qs';
import { useNavigate } from 'react-router';
import { useUrlQuery } from '../../../hooks';
import { getDisplayedPageNumberList, getRenderedPageNumber } from './utils';

function parseNumberOrDefault(str: string, defaultValue: number): number {
  const parsed = Number.parseInt(str, 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

type UsePaginationResult = {
  readonly currentPage: number;
  readonly getPaginatedData: <T>(
    data: ReadonlyArray<T>,
    itemsPerPage: number,
  ) => Array<T>;
  readonly setPage: (page: number) => void;
  readonly getRenderedPageNumber: (page: number) => string;
  readonly getDisplayedPageNumberList: (
    currentPage: number,
    amountOfNeighbours: number,
    totalPages: number,
  ) => number[];
};

export function usePagination(): UsePaginationResult {
  const navigate = useNavigate();
  const { queryParams } = useUrlQuery();
  const initialPage = parseNumberOrDefault(queryParams?.page as string, 1);

  const getPaginatedData = <T>(
    data: ReadonlyArray<T>,
    itemsPerPage: number,
  ) => {
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
    navigate({
      search: qs.stringify(updatedUrlQuery),
    });
  };

  return {
    currentPage: initialPage,
    getPaginatedData,
    setPage,
    getRenderedPageNumber,
    getDisplayedPageNumberList,
  };
}
