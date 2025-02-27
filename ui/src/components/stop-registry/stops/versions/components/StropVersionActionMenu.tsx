import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlignDirection,
  SimpleDropdownMenu,
} from '../../../../../uiComponents';
import { OpenDetailsPage, ShowOnMap } from '../../../components';
import { LocatableStop } from '../../../types';

const testIds = {
  actionMenu: 'StopVersion::actionMenu',
};

type StopVersionActionMenuProps = {
  readonly className?: string;
  readonly locatableStop: LocatableStop;
};

export const StopVersionActionMenu: FC<StopVersionActionMenuProps> = ({
  className,
  locatableStop,
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
      <ShowOnMap stop={locatableStop} />
      <OpenDetailsPage stop={locatableStop} />
    </SimpleDropdownMenu>
  );
};
