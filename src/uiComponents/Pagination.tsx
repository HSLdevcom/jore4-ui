import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePagination } from '../hooks/usePagination';
import { Row } from '../layoutComponents';
import { IconButton } from './IconButton';

interface Props {
  totalCount: number;
  amountOfNeighbours?: number;
  contentPerPage?: number;
  className?: string;
}

const DEFAULT_AMOUNT_OF_NEIGHBOURS = 2;
const DEFAULT_CONTENT_PER_PAGE = 10;

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
  const commonClassName = 'text-1xl px-4 py-2  w-14';

  return (
    <Row className={className}>
      <IconButton
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
          {showDotsNearStart && <span className={commonClassName}>...</span>}
        </>
      )}
      {displayedPageNumbers.map((pageNumber) => (
        <button
          onClick={() => setPage(pageNumber)}
          type="button"
          key={pageNumber}
          className={`${commonClassName} ${
            pageNumber === currentPage ? currentPageClassName : ''
          }`}
        >
          {getRenderedPageNumber(pageNumber)}
        </button>
      ))}
      {showAdditionalElementsOnEnd && (
        <>
          {showDotsNearEnd && <span className={commonClassName}>...</span>}
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
        icon={
          <FaChevronRight
            className={`text-3xl ${
              onLastPage ? 'text-light-grey' : 'text-tweaked-brand'
            }`}
          />
        }
      />
    </Row>
  );
};
