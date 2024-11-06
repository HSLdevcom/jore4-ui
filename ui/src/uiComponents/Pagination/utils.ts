import range from 'lodash/range';

const ADDITIONAL_BUTTON_AMOUNT = 2;

/** Determines the starting and ending index to slice the shown page numbers
 *
 * @param currentPage
 * @param amountOfNeighbours determines how many page numbers are rendered on
 * each side of the current page before dots. For example, if amountOfNeighbours = 2
 * And current page is 7 then we render ... 5 6 7 8 9 ... If amountOfNeighbours = 1
 * we render ... 6 7 8 ...
 * @param totalPages
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

export const getDisplayedPageNumberList = (
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
export const getRenderedPageNumber = (page: number) =>
  page < 10 ? `0${page}` : page.toString();
