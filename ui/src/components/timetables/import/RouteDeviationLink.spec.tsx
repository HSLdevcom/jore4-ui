import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { RouteDirectionEnum } from '../../../generated/graphql';
import { render } from '../../../utils/test-utils';
import { RouteDeviationLink } from './RouteDeviationLink';

const deviationWithoutVariant = {
  label: '108N',
  lineId: '123',
  direction: RouteDirectionEnum.Inbound,
  routeName: buildLocalizedString('Route name that shows on title'),
  routeId: uniqueId(),
  variant: null,
};

describe(`<${RouteDeviationLink.name} />`, () => {
  test('should render label text', () => {
    const { getByText } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={1}
        testId="RouteDeviationLink::1"
      />,
    );

    expect(getByText('108N')).toBeInTheDocument();
  });

  test('should render direction badge text', () => {
    const { getByText } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={1}
        testId="RouteDeviationLink::1"
      />,
    );

    expect(getByText('2')).toBeInTheDocument();
  });
  test('should render direction badge title', () => {
    const { getByTitle } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={1}
        testId="RouteDeviationLink::1"
      />,
    );

    expect(getByTitle('2 - Keskustaan päin')).toBeInTheDocument();
  });
  test('should render correct link', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={1}
        testId="RouteDeviationLink::1"
      />,
    );

    expect(getByTestId('RouteDeviationLink::1').getAttribute('href')).toBe(
      `/lines/123?routeLabels=108N`,
    );
  });

  test('should render title', () => {
    const { getByTitle } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={1}
        testId="RouteDeviationLink::1"
      />,
    );

    expect(getByTitle('Route name that shows on title')).toBeInTheDocument();
  });

  test('should render comma before element when index is greater than 0', () => {
    const { getByText } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={3}
        testId="RouteDeviationLink::1"
      />,
    );
    expect(getByText(',')).toBeInTheDocument();
  });

  test('should not render comma before element when index is 0', () => {
    const { queryByText } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        index={0}
        testId="RouteDeviationLink::1"
      />,
    );
    expect(queryByText(',')).not.toBeInTheDocument();
  });

  test('should show variant when not null', () => {
    const { getByText } = render(
      <RouteDeviationLink
        deviation={{ ...deviationWithoutVariant, variant: 3 }}
        index={0}
        testId="RouteDeviationLink::1"
      />,
    );
    expect(getByText('3')).toBeInTheDocument();
  });
});
