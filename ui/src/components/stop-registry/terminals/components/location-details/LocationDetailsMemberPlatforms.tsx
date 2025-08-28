import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../types';
import { LabeledDetail } from '../../../stops/stop-details/layout';

type MemberPlatformsDisplayProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly testId?: string;
  readonly className?: string;
};

const getMemberPlatforms = (terminal: EnrichedParentStopPlace): string => {
  const memberPlatforms =
    terminal.children
      ?.flatMap((child) => child?.quays ?? [])
      .map((quay) => quay?.placeEquipments?.generalSign?.[0]?.content?.value)
      .filter(Boolean)
      .sort() ?? [];

  return memberPlatforms.length ? memberPlatforms.join(', ') : '-';
};

const getMemberPlatformsTotal = (terminal: EnrichedParentStopPlace): number => {
  return (
    terminal.children
      ?.flatMap((child) => child?.quays ?? [])
      .filter(
        (quay) =>
          quay?.placeEquipments?.generalSign?.[0]?.content?.value !== undefined,
      ).length ?? 0
  );
};

export const MemberPlatformsDisplay: FC<MemberPlatformsDisplayProps> = ({
  terminal,
  testId,
  className,
}) => {
  const { t } = useTranslation();
  const memberPlatforms = getMemberPlatforms(terminal);
  const memberPlatformsTotal = getMemberPlatformsTotal(terminal);

  return (
    <LabeledDetail
      title={t('terminalDetails.location.memberPlatforms', {
        total: memberPlatformsTotal,
      })}
      detail={memberPlatforms}
      testId={testId}
      className={className}
    />
  );
};
