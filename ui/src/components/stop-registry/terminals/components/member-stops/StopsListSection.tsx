import compact from 'lodash/compact';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { EnrichedParentStopPlace } from '../../../../../types';
import {
  StopSearchRow,
  mapRawTiamatStopAreaQuaysToStopSearchRows,
} from '../../../components';
import { AddMemberStopsHeader } from './AddMemberStops';
import { StopAreaSection } from './StopAreaSection';

const testIds = {
  stopsTitle: 'TerminalDetailsPage::stopsTitle',
};

type StopsProps = {
  readonly terminal: EnrichedParentStopPlace;
};

type StopAreaData = {
  readonly id: string;
  readonly name: string;
  readonly privateCode: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

function mapChildrenToStopAreas(
  terminal: EnrichedParentStopPlace,
): ReadonlyArray<StopAreaData> {
  const children = compact(terminal.children);
  const sections = children.map((child) => ({
    id: child.id ?? '',
    privateCode: child.privateCode?.value ?? '',
    name: child.name?.value ?? '',
    stops: mapRawTiamatStopAreaQuaysToStopSearchRows(child),
  }));

  return sections.toSorted((a, b) => a.name.localeCompare(b.name));
}

export const StopsListSection: FC<StopsProps> = ({ terminal }) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const stopAreas = useMemo(() => mapChildrenToStopAreas(terminal), [terminal]);

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h2 data-testid={testIds.stopsTitle}>
          {t('terminalDetails.stops.title')}
        </h2>

        <AddMemberStopsHeader terminal={terminal} />
      </div>

      {stopAreas.map((section) => (
        <StopAreaSection
          key={section.id}
          privateCode={section.privateCode}
          name={section.name}
          stops={section.stops}
          observationDate={observationDate}
        />
      ))}
    </>
  );
};
