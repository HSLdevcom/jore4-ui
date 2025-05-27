import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { TerminalComponentProps } from '../../types';

const testIds = {
  container: 'LocationDetailsViewCard::container',
  streetAddress: 'LocationDetailsViewCard::streetAddress',
  postalCode: 'LocationDetailsViewCard::postalCode',
  municipality: 'LocationDetailsViewCard::municipality',
  fareZone: 'LocationDetailsViewCard::fareZone',
  latitude: 'LocationDetailsViewCard::latitude',
  longitude: 'LocationDetailsViewCard::longitude',
  memberStops: 'LocationDetailsViewCard::memberStops',
  memberPlatforms: 'LocationDetailsViewCard::memberPlatforms',
};

const getMemberStops = (terminal: EnrichedParentStopPlace): string => {
  const quayCodes =
    terminal.children
      ?.flatMap((child) => child?.quays ?? [])
      .map((quay) => quay?.publicCode)
      .filter(Boolean)
      .sort() ?? [];

  return quayCodes.length ? quayCodes.join(', ') : '-';
};

export const LocationDetailsView: FC<TerminalComponentProps> = ({
  terminal,
}) => {
  const { t } = useTranslation();
  const memberStops = getMemberStops(terminal);

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('terminalDetails.location.streetAddress')}
          detail={terminal.streetAddress}
          testId={testIds.streetAddress}
        />
        <LabeledDetail
          title={t('terminalDetails.location.postalCode')}
          detail={terminal.postalCode}
          testId={testIds.postalCode}
        />
        <LabeledDetail
          title={t('terminalDetails.location.municipality')}
          detail={terminal.municipality}
          testId={testIds.municipality}
        />
        <LabeledDetail
          title={t('terminalDetails.location.fareZone')}
          detail={terminal.fareZone}
          testId={testIds.fareZone}
        />
        <LabeledDetail
          title={t('terminalDetails.location.latitude')}
          detail={terminal.locationLat}
          testId={testIds.latitude}
        />
        <LabeledDetail
          title={t('terminalDetails.location.longitude')}
          detail={terminal.locationLong}
          testId={testIds.longitude}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('terminalDetails.location.memberStopsTotal', {
            total: terminal.children?.length ?? 0,
          })}
          detail={memberStops}
          testId={testIds.memberStops}
        />
        <LabeledDetail
          title={t('terminalDetails.location.memberPlatforms')}
          detail="-"
          testId={testIds.memberPlatforms}
        />
      </DetailRow>
    </div>
  );
};
