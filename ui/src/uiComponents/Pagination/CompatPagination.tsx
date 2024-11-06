import { FC } from 'react';
import { Pagination } from './Pagination';
import { usePagination } from './usePagination';

type ClassNameProps = { readonly className?: string };

type CompatPaginationProps = {
  totalItemsCount: number;
  amountOfNeighbours?: number;
  itemsPerPage?: number;
} & ClassNameProps;

const DEFAULT_AMOUNT_OF_NEIGHBOURS = 2;
const DEFAULT_ITEMS_PER_PAGE = 10;

/**
 * Compatability Pagination component (Pagination + usePagination-hook)
 *
 * @param amountOfNeighbours determines how many page numbers are rendered on
 * each side of the current page before dots. For example, if amountOfNeighbours = 2
 * And current page is 7 then we render ... 5 6 7 8 9 ... If amountOfNeighbours = 1
 * we render ... 6 7 8 ... (default = 2)
 * @param totalItemsCount the total count of the data which is being paginated
 * @param itemsPerPage how many items there are per page (default=10)
 * @param className
 */
export const CompatPagination: FC<CompatPaginationProps> = ({
  amountOfNeighbours = DEFAULT_AMOUNT_OF_NEIGHBOURS,
  totalItemsCount,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  className,
}) => {
  const { currentPage, setPage } = usePagination();

  return (
    <Pagination
      amountOfNeighbours={amountOfNeighbours}
      className={className}
      pagingInfo={{ page: currentPage, pageSize: itemsPerPage }}
      setPagingInfo={({ page }) => setPage(page)}
      totalItemsCount={totalItemsCount}
    />
  );
};
