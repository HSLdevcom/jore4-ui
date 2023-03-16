import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { pipe, uniq } from 'remeda';
import {
  TimetablesView,
  useGetLineDetails,
  useRouteLabelsQueryParam,
  useTimetableVersionsReturnToQueryParam,
  useTimetablesViewState,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormColumn, FormRow } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { LineTitle } from '../../routes-and-lines/line-details/LineTitle';
import { RouteTimetableList } from './RouteTimetableList';
import { TimetableNavigation } from './TimetableNavigation';

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const { line } = useGetLineDetails();

  const { getVersionsUrl } = useTimetableVersionsReturnToQueryParam();

  const { routeLabel, setShowDefaultView, activeView } =
    useTimetablesViewState();
  const { displayedRouteLabels, setDisplayedRoutesToUrl } =
    useRouteLabelsQueryParam();

  const uniqueLineRouteLabels = pipe(
    line?.line_routes,
    (routes) => routes?.map((route) => route.label) || [],
    (routeLabels) => uniq(routeLabels),
  );

  // If no route has been initially selected to display, show all line's routes
  // Set the default value to query params if route labels query param doesn't exist
  useEffect(() => {
    if (!displayedRouteLabels && uniqueLineRouteLabels.length !== 0) {
      setDisplayedRoutesToUrl(uniqueLineRouteLabels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueLineRouteLabels]);

  // For default view show all routes,
  // Otherwise show only selected view.
  // TODO: Add route toggles to header, after that only show
  // selected routes for default view as well
  const displayedRoutes =
    activeView === TimetablesView.DEFAULT
      ? line?.line_routes?.filter((route) =>
          displayedRouteLabels?.includes(route.label),
        ) || []
      : line?.line_routes.filter((route) => route.label === routeLabel) || [];

  return (
    <div>
      <PageHeader>
        {line && <LineTitle line={line} hideValidityPeriod />}
      </PageHeader>
      {line && activeView !== TimetablesView.DEFAULT && (
        <TimetableNavigation onClose={setShowDefaultView} />
      )}
      <Container className="py-10">
        <FormRow mdColumns={2} className="mb-8 ">
          <ObservationDateControl className="max-w-max" />
          <FormColumn className="items-end justify-end">
            {line && (
              <SimpleButton
                inverted
                href={getVersionsUrl(line.label, line.line_id)}
              >
                {t('timetables.showVersions')}
              </SimpleButton>
            )}
          </FormColumn>
        </FormRow>
        <RouteTimetableList
          routeIds={displayedRoutes.map((route) => route.route_id)}
        />
      </Container>
    </div>
  );
};
