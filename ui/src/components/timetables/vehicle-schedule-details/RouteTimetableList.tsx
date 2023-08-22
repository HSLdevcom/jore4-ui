import { RouteTimetablesSection } from './RouteTimetablesSection';

interface Props {
  routeIds: UUID[];
}

export const RouteTimetableList = ({ routeIds }: Props): JSX.Element => {
  return (
    <div className="grid gap-y-5">
      <div data-testid="RouteTimetablesSection::section::99::outbound">
        <div data-testid="VehicleServiceTable::LA">
          <button
            data-testid="VehicleJourneyGroupInfo::changeValidityButton"
            type="button"
            onClick={() => console.log('fpo')}
          >
            Foo
          </button>
          <span data-testid='RouteTimetablesSection::noSchedules'>Ei vuoroja</span>
        </div>
      </div>
      {routeIds.map((item, index) => (
        <RouteTimetablesSection
          key={item}
          routeId={item}
          initiallyOpen={index === 0}
        />
      ))}
    </div>
  );
};
