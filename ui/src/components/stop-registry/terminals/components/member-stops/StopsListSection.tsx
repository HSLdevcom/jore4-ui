import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MemberStopQuayDetailsFragment } from '../../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { EnrichedParentStopPlace } from '../../../../../types';
import { StopSearchRow } from '../../../search/types';
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

function toStopSearchRow(
  quay: MemberStopQuayDetailsFragment | null | undefined,
): StopSearchRow | null {
  const ssp = quay?.scheduled_stop_point;
  if (!ssp) {
    return null;
  }
  return {
    ...ssp,
    quay: {
      netexId: quay?.id ?? null,
      nameFin: quay?.description?.value ?? null,
      nameSwe: null,
    },
  } as StopSearchRow;
}

function mapChildrenToStopAreas(
  terminal: EnrichedParentStopPlace,
): ReadonlyArray<StopAreaData> {
  const children = terminal.children ?? [];
  const sections = children.map((child) => ({
    id: child?.id ?? '',
    privateCode: child?.privateCode?.value ?? '',
    name: child?.name?.value ?? '',
    stops: (child?.quays ?? [])
      .map(toStopSearchRow)
      .filter((row): row is StopSearchRow => row !== null),
  }));

  sections.toSorted((a, b) => a.name.localeCompare(b.name));

  return sections;
}

export const StopsListSection: FC<StopsProps> = ({ terminal }) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const stopAreas = useMemo(() => mapChildrenToStopAreas(terminal), [terminal]);

  return (
    <>
      <h2 data-testid={testIds.stopsTitle}>
        {t('terminalDetails.stops.title')}
      </h2>
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
