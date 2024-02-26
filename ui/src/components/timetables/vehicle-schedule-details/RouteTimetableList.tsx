import { RouteTimetablesSection } from './RouteTimetablesSection';

interface Props {
  routeIds: UUID[];
}

export const RouteTimetableList = ({ routeIds }: Props): JSX.Element => {
  return (
    <div className="grid gap-y-5">
      {routeIds.map((item) => (
        <RouteTimetablesSection key={item} routeId={item} />
      ))}
    </div>
  );
};
