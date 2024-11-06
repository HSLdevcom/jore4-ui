import { act, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import { useState } from 'react';
import { PagingInfo } from '../../types';
import { render } from '../../utils/test-utils';
import { Pagination } from './Pagination';

const ButtonClickTestComponent = () => {
  const [pagingInfo, setPagingInfo] = useState<PagingInfo>({
    page: 1,
    pageSize: 2,
  });
  return (
    <Pagination
      pagingInfo={pagingInfo}
      setPagingInfo={setPagingInfo}
      totalItemsCount={20}
    />
  );
};

describe('Pagination', () => {
  test('should render all 5 page numbers', () => {
    render(
      <Pagination
        pagingInfo={{ page: 1, pageSize: 2 }}
        totalItemsCount={10}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByText('01')).toBeVisible();
    expect(screen.getByText('02')).toBeVisible();
    expect(screen.getByText('03')).toBeVisible();
    expect(screen.getByText('04')).toBeVisible();
    expect(screen.getByText('05')).toBeVisible();
    expect(screen.queryByText('06')).toBeFalsy();
  });

  test('prev button should be disabled on first page', () => {
    render(
      <Pagination
        pagingInfo={{ page: 1, pageSize: 2 }}
        totalItemsCount={10}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByTestId('prevPageButtonIcon')).toBeDisabled();
    expect(screen.getByTestId('nextPageButtonIcon')).toBeEnabled();
  });

  test('next button should be disabled on last page', () => {
    render(
      <Pagination
        pagingInfo={{ page: 5, pageSize: 2 }}
        totalItemsCount={10}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByTestId('prevPageButtonIcon')).toBeEnabled();
    expect(screen.getByTestId('nextPageButtonIcon')).toBeDisabled();
  });

  test('prev and next button should be disabled if only one page', () => {
    render(
      <Pagination
        pagingInfo={{ page: 1, pageSize: 10 }}
        totalItemsCount={10}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByTestId('prevPageButtonIcon')).toBeDisabled();
    expect(screen.getByTestId('nextPageButtonIcon')).toBeDisabled();
  });

  test('current page should be SPAN element', () => {
    render(
      <Pagination
        pagingInfo={{ page: 1, pageSize: 2 }}
        totalItemsCount={10}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByText('01').nodeName).toBe('SPAN');
    expect(screen.getByText('02').nodeName).toBe('BUTTON');
    expect(screen.getByText('03').nodeName).toBe('BUTTON');
    expect(screen.getByText('04').nodeName).toBe('BUTTON');
    expect(screen.getByText('05').nodeName).toBe('BUTTON');
  });

  test('should render dots next to first page button', () => {
    render(
      <Pagination
        amountOfNeighbours={1}
        pagingInfo={{ page: 8, pageSize: 2 }}
        totalItemsCount={20}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByText('06')).toBeVisible();
    expect(screen.getByText('07')).toBeVisible();
    expect(screen.getByText('08')).toBeVisible();
    expect(screen.getByText('09')).toBeVisible();
    expect(screen.getByText('10')).toBeVisible();

    const dotsArray = screen.getAllByText('...');
    expect(dotsArray.length).toBe(1);

    const firstPageButton = screen.getByText('01');
    expect(firstPageButton).toBeVisible();
    // Check firstchild, because comparing the whole element
    // would timeout in case of mismatch
    expect(firstPageButton.parentElement?.nextSibling?.firstChild).toBe(
      dotsArray[0].firstChild,
    );
  });

  test('should render dots next to last page button', () => {
    render(
      <Pagination
        amountOfNeighbours={1}
        pagingInfo={{ page: 3, pageSize: 2 }}
        totalItemsCount={20}
        setPagingInfo={noop}
      />,
    );

    expect(screen.getByText('01')).toBeVisible();
    expect(screen.getByText('02')).toBeVisible();
    expect(screen.getByText('03')).toBeVisible();
    expect(screen.getByText('04')).toBeVisible();
    expect(screen.getByText('05')).toBeVisible();

    const dotsArray = screen.getAllByText('...');
    expect(dotsArray.length).toBe(1);

    const lastPageButton = screen.getByText('10');
    expect(lastPageButton).toBeVisible();

    // Check firstchild, because comparing the whole element
    // would timeout in case of mismatch
    expect(lastPageButton.parentElement?.previousSibling?.firstChild).toBe(
      dotsArray[0].firstChild,
    );
  });

  test('should render dots next to first page and last page buttons', () => {
    render(
      <Pagination
        amountOfNeighbours={1}
        pagingInfo={{ page: 5, pageSize: 2 }}
        totalItemsCount={20}
        setPagingInfo={noop}
      />,
    );

    const dotsArray = screen.getAllByText('...');
    expect(dotsArray).toHaveLength(2);

    const firstPageButton = screen.getByText('01');
    expect(firstPageButton).toBeVisible();
    // Check firstchild, because comparing the whole element
    // would timeout in case of mismatch
    expect(firstPageButton.parentElement?.nextSibling?.firstChild).toBe(
      dotsArray[0].firstChild,
    );

    expect(screen.getByText('04')).toBeVisible();
    expect(screen.getByText('05')).toBeVisible();
    expect(screen.getByText('06')).toBeVisible();

    const lastPageButton = screen.getByText('10');
    expect(lastPageButton).toBeVisible();
    expect(lastPageButton.parentElement?.previousSibling?.firstChild).toBe(
      dotsArray[1].firstChild,
    );
  });

  test('should react to button click', () => {
    render(<ButtonClickTestComponent />);

    // Start at 1
    expect(screen.getByRole('listitem', { current: 'page' })).toHaveTextContent(
      '01',
    );

    // Go to next (2)
    act(() => screen.getByTestId('nextPageButtonIcon').click());
    expect(screen.getByRole('listitem', { current: 'page' })).toHaveTextContent(
      '02',
    );

    // Go to last (10)
    act(() => screen.getByText('10').click());
    expect(screen.getByRole('listitem', { current: 'page' })).toHaveTextContent(
      '10',
    );

    // Go to previous (9)
    act(() => screen.getByTestId('prevPageButtonIcon').click());
    expect(screen.getByRole('listitem', { current: 'page' })).toHaveTextContent(
      '09',
    );

    // Go to first (1)
    act(() => screen.getByText('01').click());
    expect(screen.getByRole('listitem', { current: 'page' })).toHaveTextContent(
      '01',
    );
  });
});
