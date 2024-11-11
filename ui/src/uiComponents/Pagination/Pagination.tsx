import clamp from 'lodash/clamp';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { twJoin, twMerge } from 'tailwind-merge';
import { PagingInfo } from '../../types';
import { IconButton } from '../IconButton';
import { getDisplayedPageNumberList, getRenderedPageNumber } from './utils';

const testId = {
  previousPageButton: 'Pagination::page::previous',
  pageButton: (pageNumber: number) => `Pagination::page::${pageNumber}`,
  nextPageButton: 'Pagination::page::next',
};

const DEFAULT_AMOUNT_OF_NEIGHBOURS = 2;

const currentPageClassName =
  'rounded-full border border-brand bg-brand text-white';

const commonClassName = 'text-1xl px-4 py-2 text-center flex-1 cursor-pointer';

type ClassNameProps = { readonly className?: string };

const Dots: FC<ClassNameProps> = ({ className }) => (
  <span className={className}>...</span>
);

type PageButtonProps = ClassNameProps & {
  readonly pageNumber: number;
  readonly setPage: (page: number) => void;
};

const PageButton: FC<PageButtonProps> = ({
  className,
  pageNumber,
  setPage,
}) => {
  const { t } = useTranslation();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      className={twJoin('inline-block', className)}
      onClick={() => setPage(pageNumber)}
    >
      <button
        type="button"
        aria-label={`${t('accessibility:common.goToPage')} ${pageNumber}`}
        data-testid={testId.pageButton(pageNumber)}
      >
        {getRenderedPageNumber(pageNumber)}
      </button>
    </li>
  );
};

type PaginationProps = ClassNameProps & {
  readonly amountOfNeighbours?: number;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly totalItemsCount: number;
};

/**
 * Compatability Pagination component (Pagination + usePagination-hook)
 *
 * @param amountOfNeighbours determines how many page numbers are rendered on
 * each side of the current page before dots. For example, if amountOfNeighbours = 2
 * And current page is 7 then we render ... 5 6 7 8 9 ... If amountOfNeighbours = 1
 * we render ... 6 7 8 ... (default = 2)
 *
 * @param className
 * @param totalItemsCount the total count of the data which is being paginated
 * @param currentPage index of currently active page
 * @param pageSize how many items there are per page
 * @param setPagingInfo change page or page size
 */
export const Pagination: FC<PaginationProps> = ({
  amountOfNeighbours = DEFAULT_AMOUNT_OF_NEIGHBOURS,
  className,
  pagingInfo: { page: currentPage, pageSize },
  setPagingInfo,
  totalItemsCount,
}) => {
  const { t } = useTranslation();

  const totalPages = Math.ceil(totalItemsCount / pageSize);

  const setPage = (page: number) => {
    setPagingInfo({ page: clamp(page, 1, totalPages), pageSize });
  };

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

  const ariaLabelPrevious = t('accessibility:common.prevPage');
  const ariaLabelNext = t('accessibility:common.nextPage');

  return (
    <nav
      role="navigation"
      aria-label={`${t('accessibility:common.paginationNavigation')}`}
      className={twMerge('flex justify-evenly', className)}
    >
      <IconButton
        disabled={onFirstPage}
        tooltip={ariaLabelPrevious}
        onClick={() => setPage(currentPage - 1)}
        testId={testId.previousPageButton}
        className="w-32"
        icon={
          <FaChevronLeft
            className={twJoin(
              'text-3xl',
              onFirstPage ? 'text-light-grey' : 'text-tweaked-brand',
            )}
            aria-hidden
          />
        }
        ariaAttributes={{ ariaLabel: ariaLabelPrevious }}
      />

      {showAdditionalElementsOnStart && (
        <>
          <PageButton
            className={commonClassName}
            pageNumber={firstPageNumber}
            setPage={setPage}
          />
          {showDotsNearStart && <Dots className={commonClassName} />}
        </>
      )}

      <ul className="flex flex-1 justify-evenly">
        {displayedPageNumbers.map((pageNumber) =>
          pageNumber !== currentPage ? (
            <PageButton
              className={commonClassName}
              key={pageNumber}
              pageNumber={pageNumber}
              setPage={setPage}
            />
          ) : (
            <li
              className={twJoin(
                'inline-block',
                commonClassName,
                currentPageClassName,
              )}
              key={pageNumber}
              aria-current="page"
            >
              <span
                aria-label={t('accessibility:common.currentPage', {
                  pageNumber,
                })}
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
          <PageButton
            className={commonClassName}
            pageNumber={lastPageNumber}
            setPage={setPage}
          />
        </>
      )}

      <IconButton
        disabled={onLastPage}
        tooltip={ariaLabelNext}
        onClick={() => setPage(currentPage + 1)}
        testId={testId.nextPageButton}
        className="w-32"
        icon={
          <FaChevronRight
            className={twJoin(
              'text-3xl',
              onLastPage ? 'text-light-grey' : 'text-tweaked-brand',
            )}
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
