import { gql } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetRouteWithJourneyPatternQuery } from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
import { Row, Visible } from '../../../layoutComponents';
import { LoadingState, selectLoader, selectTimetable } from '../../../redux';
import { DayType } from '../../../types/enums';
import { AccordionButton } from '../../../uiComponents';
import { LoadingWrapper } from '../../../uiComponents/LoadingWrapper';
import { useToggle } from '../../common/hooks/useToggle';
import { RouteLabel } from '../../common/RouteLabel';
import { DirectionBadge } from '../../routes-and-lines/line-details/DirectionBadge';
import {
  TimetablesView,
  useTimetablesViewState,
} from '../common/useTimetablesViewState';
import { PassingTimesByStopSection } from '../passing-times-by-stop/PassingTimesByStopSection';
import { useGetRouteTimetables } from './useGetRouteTimetables';
import { VehicleServiceTable } from './vehicle-service-table';

const GQL_GET_ROUTE_WITH_JOURNEY_PATTERN = gql`
  query GetRouteWithJourneyPattern($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_with_journey_pattern_stops
    }
  }
`;

type RouteTimetablesSectionProps = {
  readonly routeId: UUID;
  readonly initiallyOpen?: boolean;
};

const testIds = {
  accordionToggle: 'RouteTimetablesSection::AccordionToggle',
  timetableSection: (routeLabel: string, routeDirection: string) =>
    `RouteTimetablesSection::section::${routeLabel}::${routeDirection}`,
  loadingRouteTimetables: 'LoadingWrapper::loadingRouteTimetables',
};

export const RouteTimetablesSection: FC<RouteTimetablesSectionProps> = ({
  routeId,
  initiallyOpen = true,
}) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const [isOpen, toggleIsOpen] = useToggle(initiallyOpen);

  const { showAllValid } = useAppSelector(selectTimetable);
  const { fetchRouteTimetables } = useAppSelector(selectLoader);

  const { activeView, setShowPassingTimesByStop } = useTimetablesViewState();
  const routeResult = useGetRouteWithJourneyPatternQuery({
    variables: { routeId },
  });
  const route = routeResult.data?.route_route_by_pk;

  const { timetables } = useGetRouteTimetables(
    route?.route_journey_patterns[0].journey_pattern_id,
  );

  if (!route) {
    return null;
  }

  // depending on the showAll mode, we either show all day type timetables
  // which are currently ordered only by day type
  // OR we only show the one with inEffect value as true.
  const displayedVehicleJourneyGroups = (() => {
    const vehicleJourneyGroups = showAllValid
      ? timetables?.vehicleJourneyGroups
      : timetables?.vehicleJourneyGroups.filter((vjGroup) => vjGroup.inEffect);
    return sortBy(vehicleJourneyGroups, [
      (item) => DayType[item.dayType.label as keyof typeof DayType],
    ]);
  })();
  const routeName = getLocalizedTextFromDbBlob(route.name_i18n);
  const sectionIdentifier = `${route.direction}-${route.label}-route-timetables-section`;

  return (
    <div data-testid={testIds.timetableSection(route.label, route.direction)}>
      <Row>
        <div className="flex flex-1 items-center bg-background">
          <DirectionBadge direction={route.direction} className="my-5 ml-12" />
          <h3 className="m-3.5">
            <RouteLabel label={route.label} variant={route.variant} />
          </h3>
          <span className="text-xl">{routeName}</span>
        </div>
        <div className="ml-1 bg-background p-3">
          <AccordionButton
            className="h-full w-full"
            iconClassName="text-3xl"
            isOpen={isOpen}
            onToggle={toggleIsOpen}
            testId={testIds.accordionToggle}
            openTooltip={t('accessibility:routes.expandTimetable', {
              routeName,
            })}
            closeTooltip={t('accessibility:routes.closeTimetable', {
              routeName,
            })}
            controls={sectionIdentifier}
          />
        </div>
      </Row>
      <LoadingWrapper
        className="flex justify-center p-5"
        loading={fetchRouteTimetables !== LoadingState.NotLoading}
        testId={testIds.loadingRouteTimetables}
      >
        <Visible visible={isOpen}>
          <div id={sectionIdentifier} className="mt-8">
            {activeView === TimetablesView.DEFAULT && (
              <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                {displayedVehicleJourneyGroups?.map((item) => (
                  <VehicleServiceTable
                    vehicleJourneyGroup={item}
                    key={`${item.priority}-${item.dayType.day_type_id}`}
                    onClick={() =>
                      setShowPassingTimesByStop(route.label, item.dayType.label)
                    }
                  />
                ))}
              </div>
            )}
            {activeView === TimetablesView.PASSING_TIMES_BY_STOP &&
              timetables && (
                <PassingTimesByStopSection
                  vehicleJourneyGroups={timetables.vehicleJourneyGroups}
                  route={route}
                />
              )}
          </div>
          <Visible visible={!displayedVehicleJourneyGroups.length}>
            <p>{t('timetables.noSchedules')}</p>
          </Visible>
        </Visible>
      </LoadingWrapper>
    </div>
  );
};
