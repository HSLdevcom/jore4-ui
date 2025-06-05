import React from 'react';
import { mapToShortDate } from '../../../../../time';
import { StopVersion } from '../../../stops/versions/types';

const testIds = {
  stopVersionsList: 'MemberStops::stopVersionsList',
};

type StopVersionsListProps = {
  readonly versions: ReadonlyArray<StopVersion>;
  readonly title: string;
};

export const StopVersionsList: React.FC<StopVersionsListProps> = ({
  versions,
  title,
}) => {
  return (
    <div className="mt-4" data-testid={testIds.stopVersionsList}>
      <p className="mb-2 font-bold">{title}</p>
      <div className="border border-dark-grey">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex items-start gap-4 border-b border-dark-grey bg-white p-4 text-sm last:border-b-0"
          >
            <div>
              <strong>{version.public_code}</strong>
            </div>
            <div>
              <div>{version.stop_place_name}</div>
              <div>
                {mapToShortDate(version.validity_start)} -{' '}
                {mapToShortDate(version.validity_end)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
