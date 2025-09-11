import { Switch as HuiSwitch } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Container, Row, Visible } from '../../../layoutComponents';
import {
  closeChangeTimetableValidityModalAction,
  selectChangeTimetableValidityModal,
  selectTimetable,
} from '../../../redux';
import {
  setShowAllValidAction,
  setShowArrivalTimesAction,
} from '../../../redux/slices/timetable';
import { SimpleButton, Switch, SwitchLabel } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormColumn, FormRow } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { LineTitle } from '../../routes-and-lines/line-details/LineTitle';
import { useGetLineDetails } from '../../routes-and-lines/line-details/useGetLineDetails';
import { useGetRoutesDisplayedInList } from '../../routes-and-lines/line-details/useGetRoutesDisplayedInList';
import { ChangeTimetablesValidityModal } from '../common/ChangeTimetablesValidityModal';
import {
  TimetablesView,
  useTimetablesViewState,
} from '../common/useTimetablesViewState';
import { useTimetableVersionsReturnToQueryParam } from '../versions/hooks/useTimetableVersionsReturnToQueryParam';
import { RouteTimetableList } from './RouteTimetableList';
import { TimetableNavigation } from './TimetableNavigation';

const testIds = {
  showArrivalTimesSwitch: 'VehicleScheduleDetailsPage::showArrivalTimesSwitch',
  showAllValidSwitch: 'VehicleScheduleDetailsPage::showAllValidSwitch',
  showVersionsButton: 'VehicleScheduleDetailsPage::showVersionsButton',
};

export const VehicleScheduleDetailsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { line } = useGetLineDetails();

  const { getVersionsUrl } = useTimetableVersionsReturnToQueryParam();

  const { routeLabel, setShowDefaultView, activeView } =
    useTimetablesViewState();
  const { displayedRouteLabels } = useGetRoutesDisplayedInList(line);
  const { showArrivalTimes, showAllValid } = useAppSelector(selectTimetable);
  const changeTimetableValidityModalState = useAppSelector(
    selectChangeTimetableValidityModal,
  );

  const onShowArrivalTimesChanged = (enabled: boolean) => {
    dispatch(setShowArrivalTimesAction(enabled));
  };

  const onShowAllValidChanged = (enabled: boolean) => {
    dispatch(setShowAllValidAction(enabled));
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
      ? (line?.line_routes?.filter((route) =>
          displayedRouteLabels?.includes(route.label),
        ) ?? [])
      : (line?.line_routes.filter((route) => route.label === routeLabel) ?? []);

  return (
    <div>
      <PageHeader>
        <Row>
          <i className="icon-bus-alt text-6xl text-tweaked-brand" />
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
        </Row>
      </PageHeader>
      <Visible visible={line && activeView !== TimetablesView.DEFAULT}>
        <TimetableNavigation onClose={setShowDefaultView} />
      </Visible>
      <Container>
        <FormRow mdColumns={6} className="mb-8">
          <ObservationDateControl className="max-w-max" />
          <Visible visible={activeView === TimetablesView.DEFAULT}>
            <div className="col-span-2 mb-1 flex items-center justify-normal space-x-4 self-end">
              <HuiSwitch.Group>
                <SwitchLabel>{t('timetables.showAllValid')}</SwitchLabel>
                <Switch
                  checked={showAllValid}
                  testId={testIds.showAllValidSwitch}
                  className="mb-1"
                  onChange={onShowAllValidChanged}
                />
              </HuiSwitch.Group>
            </div>
          </Visible>
          <Visible
            visible={activeView === TimetablesView.PASSING_TIMES_BY_STOP}
          >
            <div className="col-span-2 flex items-center justify-normal space-x-4 self-end">
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
                testId={testIds.showVersionsButton}
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
