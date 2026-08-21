import { FC } from 'react';
import { RouteTimetablesSection } from './RouteTimetablesSection';

type RouteTimetableListProps = {
  readonly routeIds: ReadonlyArray<UUID>;
};

export const RouteTimetableList: FC<RouteTimetableListProps> = ({
  routeIds,
}) => {
  return (
    <div className="grid gap-y-5">
      {routeIds.map((item) => (
        <RouteTimetablesSection key={item} routeId={item} />
      ))}
    </div>
  );
};
