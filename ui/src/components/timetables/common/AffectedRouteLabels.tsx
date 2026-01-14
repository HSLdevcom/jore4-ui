import { FC } from 'react';

type AffectedRouteLabelsProps = {
  readonly affectedRouteLabels: ReadonlyArray<string>;
  readonly text: string;
};

export const AffectedRouteLabels: FC<AffectedRouteLabelsProps> = ({
  affectedRouteLabels,
  text,
}) => {
  return (
    <div className="my-6 flex flex-row items-center gap-6">
      <i className="icon-alert text-hsl-red" />
      <div className="space-y-1 text-sm">
        <p className="font-bold">{text}</p>
        <p>{affectedRouteLabels.join(', ')}</p>
      </div>
    </div>
  );
};
