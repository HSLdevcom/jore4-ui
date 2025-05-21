import { RouteTimetablesSection } from './RouteTimetablesSection';

interface Props {
  routeIds: ReadonlyArray<UUID>;
}

export const RouteTimetableList = ({ routeIds }: Props): React.ReactElement => {
  return (
    <div className="grid gap-y-5">
      {routeIds.map((item) => (
        <RouteTimetablesSection key={item} routeId={item} />
      ))}
    </div>
  );
};
