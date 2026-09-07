import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenu } from '../../../../common/Dropdowns';
import { OpenDetailsPage, ShowOnMap } from '../../../Components';
import { ActionMenuStop } from '../Types/ActionMenuStop';

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
      buttonClassName="h-10 w-10"
      tooltip={t(($) => $.accessibility.common.actionMenu)}
      testId={testIds.actionMenu}
    >
      <ShowOnMap stop={stop} observationDate={stop.startDate} />
      <OpenDetailsPage
        stop={stop}
        observationDate={stop.startDate}
        priority={stop.priority}
      />
    </SimpleDropdownMenu>
  );
};
