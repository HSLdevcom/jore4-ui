import { produce } from 'immer';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useUrlQuery } from '../../hooks/urlQuery/useUrlQuery';
import { getDisplayedPageNumberList, getRenderedPageNumber } from './utils';

function parseNumberOrDefault(str: string, defaultValue: number): number {
  const parsed = Number.parseInt(str, 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

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
  const navigate = useNavigate();
  const { queryParams } = useUrlQuery();
  const initialPage = parseNumberOrDefault(queryParams?.page as string, 1);

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
};
