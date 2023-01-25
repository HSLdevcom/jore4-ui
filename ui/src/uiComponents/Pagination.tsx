import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePagination } from '../hooks/usePagination';
import { IconButton } from './IconButton';

interface ClassNameProps {
  className?: string;
}

interface Props extends ClassNameProps {
  totalItemsCount: number;
  amountOfNeighbours?: number;
  itemsPerPage?: number;
}

const DEFAULT_AMOUNT_OF_NEIGHBOURS = 2;
const DEFAULT_ITEMS_PER_PAGE = 10;

const Dots = ({ className = '' }: ClassNameProps): JSX.Element => (
  <span className={className}>...</span>
);

/**
 * Pagination component
 * @param amountOfNeighbours determines how many page numbers are rendered on
 * each side of the current page before dots. For example, if amountOfNeighbours = 2
 * And current page is 7 then we render ... 5 6 7 8 9 ... If amountOfNeighbours = 1
 * we render ... 6 7 8 ... (default = 2)
 * @param totalItemsCount the total count of the data which is being paginated
 * @param itemsPerPage how many items there are per page (default=10)
 */
export const Pagination = ({
  amountOfNeighbours = DEFAULT_AMOUNT_OF_NEIGHBOURS,
  totalItemsCount,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  className = '',
}: Props): JSX.Element => {
  const {
    currentPage,
    setPage,
    getRenderedPageNumber,
    getDisplayedPageNumberList,
  } = usePagination();
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  const displayedPageNumbers = getDisplayedPageNumberList(
    currentPage,
    amountOfNeighbours,
    totalPages,
  );

  // Booleans for rendering first and last page number (and dots) when
  // they are not rendered otherwise
  const showAdditionalElementsOnStart = displayedPageNumbers[0] !== 1;
  const showAdditionalElementsOnEnd =
    displayedPageNumbers[displayedPageNumbers.length - 1] !== totalPages;

  // Booleans for rendering dots when page numbers are skipped
  const showDotsNearStart = displayedPageNumbers[0] !== 2;
  const showDotsNearEnd =
    displayedPageNumbers[displayedPageNumbers.length - 1] !== totalPages - 1;

  const firstPageNumber = 1;
  const lastPageNumber = totalPages;

  const onFirstPage = currentPage === firstPageNumber;
  const onLastPage = currentPage === lastPageNumber;

  const currentPageClassName =
    'rounded-full border border-brand bg-brand text-white';
  const commonClassName = `text-1xl px-4 py-2 text-center flex-1`;

  // eslint-disable-next-line react/no-unstable-nested-components
  const PageButton = ({ pageNumber }: { pageNumber: number }): JSX.Element => (
    <button
      onClick={() => setPage(pageNumber)}
      type="button"
      className={commonClassName}
    >
      {getRenderedPageNumber(pageNumber)}
    </button>
  );

  return (
    <div className={`flex justify-evenly ${className}`}>
      <IconButton
        testId="prevPageButtonIcon"
        className="flex-1"
        onClick={() => setPage(currentPage - 1)}
        disabled={onFirstPage}
        icon={
          <FaChevronLeft
            className={`text-3xl ${
              onFirstPage ? 'text-light-grey' : 'text-tweaked-brand'
            }`}
          />
        }
      />
      {showAdditionalElementsOnStart && (
        <>
          <PageButton pageNumber={firstPageNumber} />
          {showDotsNearStart && <Dots className={commonClassName} />}
        </>
      )}
      {displayedPageNumbers.map((pageNumber) =>
        pageNumber !== currentPage ? (
          <PageButton key={pageNumber} pageNumber={pageNumber} />
        ) : (
          <span
            key={pageNumber}
            className={`${commonClassName} ${currentPageClassName}`}
          >
            {getRenderedPageNumber(pageNumber)}
          </span>
        ),
      )}
      {showAdditionalElementsOnEnd && (
        <>
          {showDotsNearEnd && <Dots className={commonClassName} />}
          <PageButton pageNumber={lastPageNumber} />
        </>
      )}
      <IconButton
        disabled={onLastPage}
        onClick={() => setPage(currentPage + 1)}
        testId="nextPageButtonIcon"
        className="flex-1"
        icon={
          <FaChevronRight
            className={`text-3xl ${
              onLastPage ? 'text-light-grey' : 'text-tweaked-brand'
            }`}
          />
        }
      />
    </div>
  );
};
