import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import uniqueId from 'lodash/uniqueId';
import { RouteDirectionEnum } from '../../../generated/graphql';
import { render } from '../../../utils/test-utils';
import { RouteDeviationLink } from './RouteDeviationLink';

const deviationWithoutVariant = {
  uniqueLabel: '108N',
  lineId: '123',
  direction: RouteDirectionEnum.Inbound,
  routeName: buildLocalizedString('Route name that shows on title'),
  routeId: uniqueId(),
};

describe(`<${RouteDeviationLink.name} />`, () => {
  test('should render label text', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        isLast
        testIdPrefix="RouteDeviationLink::1"
      />,
    );

    expect(getByTestId('RouteDeviationLink::1::label').textContent).toBe(
      '108N',
    );
  });

  test('should render direction badge text', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        testIdPrefix="RouteDeviationLink::1"
      />,
    );

    expect(getByTestId('DirectionBadge::inbound').textContent).toBe('2');
  });

  test('should render direction badge title', () => {
    const { getByTitle } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        testIdPrefix="RouteDeviationLink::1"
      />,
    );

    expect(getByTitle('2 - Keskustaan päin')).toBeInTheDocument();
  });

  test('should render correct link', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        testIdPrefix="RouteDeviationLink::1"
      />,
    );

    expect(
      getByTestId('RouteDeviationLink::1::link').getAttribute('href'),
    ).toBe(`/timetables/lines/123?routeLabels=108N`);
  });

  test('should render correct title', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        testIdPrefix="RouteDeviationLink::1"
      />,
    );

    expect(
      getByTestId('RouteDeviationLink::1::link').getAttribute('title'),
    ).toBe('Route name that shows on title');
  });

  test('should have comma in label when it is not the last item', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        testIdPrefix="RouteDeviationLink::3"
      />,
    );

    expect(getByTestId('RouteDeviationLink::3::label').textContent).toBe(
      '108N,',
    );
  });

  test('should not render comma when last element', () => {
    const { getByTestId } = render(
      <RouteDeviationLink
        deviation={deviationWithoutVariant}
        isLast
        testIdPrefix="RouteDeviationLink::0"
      />,
    );
    expect(getByTestId('RouteDeviationLink::0::label').textContent).toBe(
      '108N',
    );
  });
});
