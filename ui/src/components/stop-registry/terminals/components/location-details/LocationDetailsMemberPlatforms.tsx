import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../types';
import { LabeledDetail } from '../../../stops/stop-details/layout';

type MemberPlatformsProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly testId?: string;
  readonly className?: string;
};

function getMemberPlatforms(terminal: EnrichedParentStopPlace): {
  memberPlatforms: string;
  memberPlatformsTotal: number;
} {
  const memberPlatforms =
    terminal.children
      ?.flatMap((child) => child?.quays ?? [])
      .map((quay) => quay?.placeEquipments?.generalSign?.[0]?.content?.value)
      .filter(Boolean)
      .sort() ?? [];

  return {
    memberPlatforms: memberPlatforms.length ? memberPlatforms.join(', ') : '-',
    memberPlatformsTotal: memberPlatforms.length,
  };
}

export const MemberPlatforms: FC<MemberPlatformsProps> = ({
  terminal,
  testId,
  className,
}) => {
  const { t } = useTranslation();
  const { memberPlatforms, memberPlatformsTotal } =
    getMemberPlatforms(terminal);

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
