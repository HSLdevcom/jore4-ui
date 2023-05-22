import { Switch as HuiSwitch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import {
  TimetablesView,
  useAppDispatch,
  useAppSelector,
  useGetLineDetails,
  useGetRoutesDisplayedInList,
  useTimetableVersionsReturnToQueryParam,
  useTimetablesViewState,
} from '../../../hooks';
import { Container, Visible } from '../../../layoutComponents';
import {
  closeChangeTimetableValidityModalAction,
  selectChangeTimetableValidityModal,
  selectTimetable,
} from '../../../redux';
import { setShowArrivalTimesAction } from '../../../redux/slices/timetable';
import { SimpleButton, Switch, SwitchLabel } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormColumn, FormRow } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { LineTitle } from '../../routes-and-lines/line-details/LineTitle';
import { ChangeTimetablesValidityModal } from '../common/ChangeTimetablesValidityModal';
import { RouteTimetableList } from './RouteTimetableList';
import { TimetableNavigation } from './TimetableNavigation';

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { line } = useGetLineDetails();

  const { getVersionsUrl } = useTimetableVersionsReturnToQueryParam();

  const { routeLabel, setShowDefaultView, activeView } =
    useTimetablesViewState();
  const { displayedRouteLabels } = useGetRoutesDisplayedInList(line);
  const { showArrivalTimes } = useAppSelector(selectTimetable);
  const changeTimetableValidityModalState = useAppSelector(
    selectChangeTimetableValidityModal,
  );

  const onShowArrivalTimesChanged = (enabled: boolean) => {
    dispatch(setShowArrivalTimesAction(enabled));
  };

  const onCloseTimetableValidityModal = () => {
    dispatch(closeChangeTimetableValidityModalAction());
  };

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

  const testIds = {
    showArrivalTimesSwitch:
      'VehicleScheduleDetailsPage::showArrivalTimesSwitch',
  };

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
      <Visible visible={line && activeView !== TimetablesView.DEFAULT}>
        <TimetableNavigation onClose={setShowDefaultView} />
      </Visible>
      <Container className="py-10">
        <FormRow mdColumns={6} className="mb-8">
          <ObservationDateControl className="max-w-max" />
          <Visible
            visible={activeView === TimetablesView.PASSING_TIMES_BY_STOP}
          >
            <div className="justify-normal col-span-2 flex items-center space-x-4 self-end">
              <HuiSwitch.Group>
                <SwitchLabel>{t('timetables.showArrivalTimes')}</SwitchLabel>
                <Switch
                  checked={showArrivalTimes}
                  onChange={onShowArrivalTimesChanged}
                  testId={testIds.showArrivalTimesSwitch}
                />
              </HuiSwitch.Group>
            </div>
          </Visible>
          <FormColumn className="col-start-6 items-end justify-end">
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
      <ChangeTimetablesValidityModal
        isOpen={changeTimetableValidityModalState.isOpen}
        onClose={onCloseTimetableValidityModal}
      />
    </div>
  );
};
