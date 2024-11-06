import { screen } from '@testing-library/react';
import { useUrlQuery } from '../../hooks';
import { render } from '../../utils/test-utils';
import { CompatPagination } from './CompatPagination';

jest.mock('../../hooks/urlQuery/useUrlQuery', () => ({
  useUrlQuery: jest.fn().mockReturnValue({}),
}));
const urlQueryMock = useUrlQuery as jest.Mock;

describe('Pagination - CompatPagination', () => {
  test('should render all 5 page numbers', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: {} });
    render(<CompatPagination itemsPerPage={2} totalItemsCount={10} />);

    expect(screen.queryByText('01')).toBeVisible();
    expect(screen.queryByText('02')).toBeVisible();
    expect(screen.queryByText('03')).toBeVisible();
    expect(screen.queryByText('04')).toBeVisible();
    expect(screen.queryByText('05')).toBeVisible();
    expect(screen.queryByText('06')).toBeFalsy();
  });

  test('prev button should be disabled on first page', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 1 } });
    render(<CompatPagination itemsPerPage={2} totalItemsCount={10} />);

    const prevButton = await screen.findByTestId('prevPageButtonIcon');
    const nextButton = await screen.findByTestId('nextPageButtonIcon');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });

  test('next button should be disabled on last page', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 5 } });
    render(<CompatPagination itemsPerPage={2} totalItemsCount={10} />);

    const prevButton = await screen.findByTestId('prevPageButtonIcon');
    const nextButton = await screen.findByTestId('nextPageButtonIcon');

    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
  });

  test('prev and next button should be disabled if only one page', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 1 } });
    render(<CompatPagination itemsPerPage={10} totalItemsCount={10} />);

    const prevButton = await screen.findByTestId('prevPageButtonIcon');
    const nextButton = await screen.findByTestId('nextPageButtonIcon');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test('current page should be SPAN element', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 1 } });
    render(<CompatPagination itemsPerPage={2} totalItemsCount={10} />);

    const oneButton = await screen.findByText('01');
    const twoButton = await screen.findByText('02');
    const threeButton = await screen.findByText('03');
    const fourButton = await screen.findByText('04');
    const fiveButton = await screen.findByText('05');

    expect(oneButton.nodeName).toBe('SPAN');
    expect(twoButton.nodeName).toBe('BUTTON');
    expect(threeButton.nodeName).toBe('BUTTON');
    expect(fourButton.nodeName).toBe('BUTTON');
    expect(fiveButton.nodeName).toBe('BUTTON');
  });

  test('should render dots next to first page button', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 8 } });
    render(
      <CompatPagination
        amountOfNeighbours={1}
        itemsPerPage={2}
        totalItemsCount={20}
      />,
    );

    const firstPageButton = await screen.findByText('01');
    const sixButton = await screen.findByText('06');
    const sevenButton = await screen.findByText('07');
    const currentPageSpan = await screen.findByText('08');
    const nineButton = await screen.findByText('09');
    const tenButton = await screen.findByText('10');

    const dotsArray = await screen.findAllByText('...');

    expect(firstPageButton).toBeVisible();
    expect(sixButton).toBeVisible();
    expect(sevenButton).toBeVisible();
    expect(currentPageSpan).toBeVisible();
    expect(nineButton).toBeVisible();
    expect(tenButton).toBeVisible();

    expect(dotsArray.length).toBe(1);

    // Check firstchild, because comparing the whole element
    // would timeout in case of mismatch
    expect(firstPageButton.parentElement?.nextSibling?.firstChild).toBe(
      dotsArray[0].firstChild,
    );
  });

  test('should render dots next to last page button', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 3 } });
    render(
      <CompatPagination
        amountOfNeighbours={1}
        itemsPerPage={2}
        totalItemsCount={20}
      />,
    );

    const oneButton = await screen.findByText('01');
    const twoButton = await screen.findByText('02');
    const currentPageSpan = await screen.findByText('03');
    const fourButton = await screen.findByText('04');
    const fiveButton = await screen.findByText('05');
    const lastPageButton = await screen.findByText('10');

    const dotsArray = await screen.findAllByText('...');

    expect(oneButton).toBeVisible();
    expect(twoButton).toBeVisible();
    expect(currentPageSpan).toBeVisible();
    expect(fourButton).toBeVisible();
    expect(fiveButton).toBeVisible();
    expect(lastPageButton).toBeVisible();

    expect(dotsArray.length).toBe(1);

    // Check firstchild, because comparing the whole element
    // would timeout in case of mismatch
    expect(lastPageButton.parentElement?.previousSibling?.firstChild).toBe(
      dotsArray[0].firstChild,
    );
  });

  test('should render dots next to first page and last page buttons', async () => {
    urlQueryMock.mockReturnValueOnce({ queryParams: { page: 5 } });
    render(
      <CompatPagination
        amountOfNeighbours={1}
        itemsPerPage={2}
        totalItemsCount={20}
      />,
    );

    const firstPageButton = await screen.findByText('01');
    const fourButton = await screen.findByText('04');
    const currentPageSpan = await screen.findByText('05');
    const fiveButton = await screen.findByText('06');
    const lastPageButton = await screen.findByText('10');

    const dotsArray = await screen.findAllByText('...');

    expect(firstPageButton).toBeVisible();
    expect(fourButton).toBeVisible();
    expect(currentPageSpan).toBeVisible();
    expect(fiveButton).toBeVisible();
    expect(lastPageButton).toBeVisible();

    expect(dotsArray.length).toBe(2);

    // Check firstchild, because comparing the whole element
    // would timeout in case of mismatch
    expect(firstPageButton.parentElement?.nextSibling?.firstChild).toBe(
      dotsArray[0].firstChild,
    );
    expect(lastPageButton.parentElement?.previousSibling?.firstChild).toBe(
      dotsArray[1].firstChild,
    );
  });
});
