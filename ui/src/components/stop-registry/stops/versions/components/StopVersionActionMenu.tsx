import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlignDirection,
  SimpleDropdownMenu,
} from '../../../../../uiComponents';
import { OpenDetailsPage, ShowOnMap } from '../../../components';
import { ActionMenuStop } from '../types/ActionMenuStop';

const testIds = {
  actionMenu: 'StopVersionRow::actionMenu',
};

type StopVersionActionMenuProps = {
  readonly className?: string;
  readonly stop: ActionMenuStop;
};

export const StopVersionActionMenu: FC<StopVersionActionMenuProps> = ({
  className,
  stop,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleDropdownMenu
      className={className}
      buttonClassName="h-10 w-10 justify-center"
      tooltip={t('accessibility:common.actionMenu')}
      alignItems={AlignDirection.LeftBottom}
      testId={testIds.actionMenu}
    >
      <ShowOnMap stop={stop} observeOnStopValidityStartDate />
      <OpenDetailsPage
        stop={stop}
        observationDate={stop.startDate}
        priority={stop.priority}
      />
    </SimpleDropdownMenu>
  );
};
