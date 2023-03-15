import { VehicleRouteTimetableSection } from './VehicleRouteTimetableSection';

interface Props {
  routeIds: UUID[];
}

export const VehicleRouteTimetables = ({ routeIds }: Props): JSX.Element => {
  return (
    <div className="grid gap-y-5">
      {routeIds.map((item, index) => (
        <VehicleRouteTimetableSection
          key={item}
          routeId={item}
          initiallyOpen={index === 0}
        />
      ))}
    </div>
  );
};
