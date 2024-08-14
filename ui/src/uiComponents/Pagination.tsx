import { useTranslation } from 'react-i18next';
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

const Dots = ({ className = '' }: ClassNameProps): React.ReactElement => (
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
}: Props): React.ReactElement => {
  const { t } = useTranslation();
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
  const commonClassName = `text-1xl px-4 py-2 text-center flex-1 cursor-pointer`;

  // eslint-disable-next-line react/no-unstable-nested-components
  const PageButton = ({
    pageNumber,
  }: {
    pageNumber: number;
  }): React.ReactElement => (
    <li className={`inline-block ${commonClassName}`}>
      <button
        onClick={() => setPage(pageNumber)}
        type="button"
        aria-label={`${t('accessibility:common.goToPage')} ${pageNumber}`}
      >
        {getRenderedPageNumber(pageNumber)}
      </button>
    </li>
  );

  const ariaLabelPrevious = t('accessibility:common.prevPage');
  const ariaLabelNext = t('accessibility:common.nextPage');

  return (
    <nav
      aria-label={`${t('accessibility:common.paginationNavigation')}`}
      className={`flex justify-evenly ${className}`}
    >
      <IconButton
        disabled={onFirstPage}
        tooltip={ariaLabelPrevious}
        onClick={() => setPage(currentPage - 1)}
        testId="prevPageButtonIcon"
        className="w-32"
        icon={
          <FaChevronLeft
            className={`text-3xl ${
              onFirstPage ? 'text-light-grey' : 'text-tweaked-brand'
            }`}
            aria-hidden
          />
        }
        ariaAttributes={{
          ariaLabel: ariaLabelPrevious,
        }}
      />
      {showAdditionalElementsOnStart && (
        <>
          <PageButton pageNumber={firstPageNumber} />
          {showDotsNearStart && <Dots className={commonClassName} />}
        </>
      )}
      <ul className="flex flex-1 justify-evenly">
        {displayedPageNumbers.map((pageNumber) =>
          pageNumber !== currentPage ? (
            <PageButton key={pageNumber} pageNumber={pageNumber} />
          ) : (
            <li
              className={`inline-block ${commonClassName} ${currentPageClassName}`}
              key={pageNumber}
            >
              <span
                aria-label={`${t(
                  'accessibility:common.currentPage',
                )} ${pageNumber}`}
                aria-current="true"
              >
                {getRenderedPageNumber(pageNumber)}
              </span>
            </li>
          ),
        )}
      </ul>
      {showAdditionalElementsOnEnd && (
        <>
          {showDotsNearEnd && <Dots className={commonClassName} />}
          <PageButton pageNumber={lastPageNumber} />
        </>
      )}
      <IconButton
        disabled={onLastPage}
        tooltip={ariaLabelNext}
        onClick={() => setPage(currentPage + 1)}
        testId="nextPageButtonIcon"
        className="w-32"
        icon={
          <FaChevronRight
            className={`text-3xl ${
              onLastPage ? 'text-light-grey' : 'text-tweaked-brand'
            }`}
            aria-hidden
          />
        }
        ariaAttributes={{
          ariaLabel: ariaLabelNext,
        }}
      />
    </nav>
  );
};
