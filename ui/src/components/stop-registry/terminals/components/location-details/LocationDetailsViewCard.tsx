import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { TerminalComponentProps } from '../../types';
import { MemberPlatforms } from './LocationDetailsMemberPlatforms';

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

function getMemberStops(terminal: EnrichedParentStopPlace): {
  memberStops: string;
  memberStopsTotal: number;
} {
  const quays = terminal.children?.flatMap((child) => child?.quays ?? []) ?? [];
  const quayCodes = quays
    .map((quay) => quay?.publicCode)
    .filter(Boolean)
    .sort();

  return {
    memberStops: quayCodes.length ? quayCodes.join(', ') : '-',
    memberStopsTotal: quays.length,
  };
}

export const LocationDetailsView: FC<TerminalComponentProps> = ({
  terminal,
}) => {
  const { t } = useTranslation();
  const { memberStops, memberStopsTotal } = getMemberStops(terminal);

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
            total: memberStopsTotal,
          })}
          detail={memberStops}
          testId={testIds.memberStops}
          className="w-full lg:w-1/2" // Prevent large amount of stops from pushing the member platforms to the right
        />
        <MemberPlatforms terminal={terminal} testId={testIds.memberPlatforms} />
      </DetailRow>
    </div>
  );
};
