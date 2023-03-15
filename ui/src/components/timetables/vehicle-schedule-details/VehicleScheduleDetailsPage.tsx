import { useTranslation } from 'react-i18next';
import {
  TimetablesView,
  useGetLineDetails,
  useTimetableVersionsReturnToQueryParam,
  useTimetablesViewState,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormColumn, FormRow } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { TimetableNavigation } from './TimetableNavigation';
import { VehicleRouteTimetables } from './VehicleRouteTimetables';

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const { line } = useGetLineDetails();

  const { getVersionsUrl } = useTimetableVersionsReturnToQueryParam();

  const { routeLabel, setShowDefaultView, activeView } =
    useTimetablesViewState();

  // For default view show all routes,
  // Otherwise show only selected view.
  // TODO: Add route toggles to header, after that only show
  // selected routes for default view as well
  const displayedRoutes =
    activeView === TimetablesView.DEFAULT
      ? line?.line_routes || []
      : line?.line_routes.filter((route) => route.label === routeLabel) || [];

  return (
    <div>
      <PageHeader>
        <h1>
          <i className="icon-bus-alt text-tweaked-brand" />
          {t('lines.line', { label: line?.label })}
        </h1>
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
        <VehicleRouteTimetables
          routeIds={displayedRoutes.map((route) => route.route_id)}
        />
      </Container>
    </div>
  );
};
