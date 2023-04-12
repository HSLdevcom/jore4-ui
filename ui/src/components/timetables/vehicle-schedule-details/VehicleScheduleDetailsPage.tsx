import { Switch as HuiSwitch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  TimetablesView,
  useAppSelector,
  useGetLineDetails,
  useGetRoutesDisplayedInList,
  useTimetableVersionsReturnToQueryParam,
  useTimetablesViewState,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { selectTimetable } from '../../../redux';
import { setShowArrivalTimesAction } from '../../../redux/slices/timetable';
import { SimpleButton, Switch, SwitchLabel } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormColumn, FormRow } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { LineTitle } from '../../routes-and-lines/line-details/LineTitle';
import { RouteTimetableList } from './RouteTimetableList';
import { TimetableNavigation } from './TimetableNavigation';

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { line } = useGetLineDetails();

  const { getVersionsUrl } = useTimetableVersionsReturnToQueryParam();

  const { routeLabel, setShowDefaultView, activeView } =
    useTimetablesViewState();
  const { displayedRouteLabels } = useGetRoutesDisplayedInList(line);
  const { showArrivalTimes } = useAppSelector(selectTimetable);

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

  const colSpanAmount =
    activeView === TimetablesView.PASSING_TIMES_BY_STOP ? 4 : 5;
  const showVersionButtonClassName = `col-span-${colSpanAmount} items-end justify-end`;

  return (
    <div>
      <PageHeader>
        {line && (
          <LineTitle
            line={line}
            showValidityPeriod={false}
            allowSelectingMultipleRoutes={
              // If passing times by stop view is active, only allow selecting
              // one route at the time
              activeView !== TimetablesView.PASSING_TIMES_BY_STOP
            }
          />
        )}
      </PageHeader>
      {line && activeView !== TimetablesView.DEFAULT && (
        <TimetableNavigation onClose={setShowDefaultView} />
      )}
      <Container className="py-10">
        <FormRow mdColumns={6} className="mb-8 ">
          <ObservationDateControl className="max-w-max" />
          {activeView === TimetablesView.PASSING_TIMES_BY_STOP && (
            <div className="justify-normal flex items-end">
              <HuiSwitch.Group>
                <SwitchLabel className="mr-4">
                  {t('timetables.showArrivalTimes')}
                </SwitchLabel>
                <Switch
                  checked={showArrivalTimes}
                  onChange={(enabled) =>
                    dispatch(setShowArrivalTimesAction(enabled))
                  }
                  testId="show-unused-stops-switch"
                />
              </HuiSwitch.Group>
            </div>
          )}
          <FormColumn className={showVersionButtonClassName}>
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
