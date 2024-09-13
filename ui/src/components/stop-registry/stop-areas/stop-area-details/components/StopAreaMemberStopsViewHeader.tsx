import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';

const testIds = {
  addStopButton: 'MemberStops::addStopButton',
};

type StopAreaMemberStopsViewHeaderProps = {
  readonly onEditStops: () => void;
};

export const StopAreaMemberStopsViewHeader: FC<
  StopAreaMemberStopsViewHeaderProps
> = ({ onEditStops }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex-grow" />

      <SlimSimpleButton
        type="button"
        onClick={onEditStops}
        testId={testIds.addStopButton}
      >
        {t('stopAreaDetails.memberStops.addStop')}
      </SlimSimpleButton>
    </>
  );
};
