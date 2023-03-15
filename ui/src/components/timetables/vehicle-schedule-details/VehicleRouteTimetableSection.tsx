import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useGetRouteWithJourneyPatternQuery } from '../../../generated/graphql';
import {
  TimetablesView,
  useGetTimetables,
  useTimetablesViewState,
  useToggle,
} from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import { mapToShortDate } from '../../../time';
import { AccordionButton } from '../../../uiComponents';
import { RouteLabel } from '../../common/RouteLabel';
import { DirectionBadge } from '../../routes-and-lines/line-details/DirectionBadge';
import { PassingTimesByStopSection } from '../passing-times-by-stop/PassingTimesByStopSection';
import { VehicleServiceTable } from './vehicle-service-table';

const GQL_GET_ROUTE_WITH_JOURNEY_PATTERN = gql`
  query GetRouteWithJourneyPattern($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_with_journey_pattern_stops
    }
  }
`;

interface Props {
  routeId: UUID;
  initiallyOpen?: boolean;
}

const testIds = {
  accordionToggle: 'VehicleRouteTimetableSection::AccordionToggle',
};

export const VehicleRouteTimetableSection = ({
  routeId,
  initiallyOpen = false,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle(initiallyOpen);
  const { activeView, setShowPassingTimesByStop } = useTimetablesViewState();

  const routeResult = useGetRouteWithJourneyPatternQuery({
    variables: { routeId },
  });
  const route = routeResult.data?.route_route_by_pk;

  const { timetables } = useGetTimetables(
    route?.route_journey_patterns[0].journey_pattern_id,
  );

  const { validityStart, validityEnd } = timetables?.validity || {};
  const hasValidityPeriod = !!validityStart && !!validityEnd;

  if (!route) {
    return <></>;
  }

  return (
    <div>
      <Row>
        <div className="flex flex-1 items-center bg-background">
          <DirectionBadge direction={route.direction} className="my-5 ml-12" />
          <h3 className="ml-3.5">
            <RouteLabel route={route} />
          </h3>
          <Visible visible={hasValidityPeriod}>
            <p className="ml-auto mr-8">
              {t('timetables.timetableValidity', {
                validityStart: mapToShortDate(validityStart),
                validityEnd: mapToShortDate(validityEnd),
              })}
            </p>
          </Visible>
        </div>
        <div className="ml-1 bg-background p-3">
          <AccordionButton
            className="h-full w-full"
            iconClassName="text-3xl"
            isOpen={isOpen}
            onToggle={toggleIsOpen}
            testId={testIds.accordionToggle}
          />
        </div>
      </Row>
      <Visible visible={isOpen}>
        <div className="mt-8">
          {activeView === TimetablesView.DEFAULT && (
            <div className="grid grid-cols-3 gap-x-8 gap-y-5">
              {timetables?.vehicleJourneyGroups.map((item) => (
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
        <Visible visible={!timetables?.vehicleJourneyGroups.length}>
          <p>{t('timetables.noService')}</p>
        </Visible>
      </Visible>
    </div>
  );
};
