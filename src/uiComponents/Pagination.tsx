import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePagination } from '../hooks/usePagination';
import { IconButton } from './IconButton';

interface Props {
  totalCount: number;
  amountOfNeighbours?: number;
  contentPerPage?: number;
  className?: string;
}

const DEFAULT_AMOUNT_OF_NEIGHBOURS = 2;
const DEFAULT_CONTENT_PER_PAGE = 10;

/**
 * Pagination component
 * @param amountOfNeighbours determines how many page numbers are rendered on
 * each side of the current page before dots. For example, if amountOfNeighbours = 2
 * And current page is 7 then we render ... 5 6 7 8 9 ... If amountOfNeighbours = 1
 * we render ... 6 7 8 ... (default = 2)
 * @param totalCount the total count of the data which is being paginated
 * @param contentPerPage how much content there is per page (default=10)
 */
export const Pagination = ({
  amountOfNeighbours = DEFAULT_AMOUNT_OF_NEIGHBOURS,
  totalCount,
  contentPerPage = DEFAULT_CONTENT_PER_PAGE,
  className = '',
}: Props): JSX.Element => {
  const {
    currentPage,
    setPage,
    getRenderedPageNumber,
    getDisplayedPageNumberList,
  } = usePagination();
  const totalPages = Math.ceil(totalCount / contentPerPage);

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

  const DOTS = <span className={commonClassName}>...</span>;

  return (
    <div className={`flex justify-evenly ${className}`}>
      <IconButton
        testId="prevPageButtonIcon"
        className="flex-1"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
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
          <button
            onClick={() => setPage(1)}
            type="button"
            className={commonClassName}
          >
            {getRenderedPageNumber(firstPageNumber)}
          </button>
          {showDotsNearStart && DOTS}
        </>
      )}
      {displayedPageNumbers.map((pageNumber) =>
        pageNumber !== currentPage ? (
          <button
            onClick={() => setPage(pageNumber)}
            type="button"
            key={pageNumber}
            className={`${commonClassName}`}
          >
            {getRenderedPageNumber(pageNumber)}
          </button>
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
          {showDotsNearEnd && DOTS}
          <button
            onClick={() => setPage(totalPages)}
            type="button"
            className={commonClassName}
          >
            {getRenderedPageNumber(lastPageNumber)}
          </button>
        </>
      )}
      <IconButton
        disabled={currentPage === totalPages}
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
