import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete, MdUndo } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { IconButton, getHoverStyles } from '../../../../../../uiComponents';
import { StopAreaFormMember } from '../../../../../forms/stop-area';
import { StopSearchRow } from '../../../../search';

const testIds = {
  removeButton: 'StopTableRow::AreaEdit::remove',
  addBackButton: 'StopTableRow::AreaEdit::addBack',
};

function stopSearchRowToStopAreaFormMember(
  stop: StopSearchRow,
): StopAreaFormMember {
  return {
    id: stop.quay.netexId as string,
    name: {
      lang: 'fin',
      value: stop.quay.nameFin as string,
    },
    scheduled_stop_point: {
      label: stop.label,
    },
  };
}

type EditModeActionButtonProps = {
  readonly className?: string;
  readonly onAddBack: (member: StopAreaFormMember) => void;
  readonly onRemove: (stopId: string) => void;
  readonly selected: boolean;
  readonly stop: StopSearchRow;
};

export const EditModeActionButton: FC<EditModeActionButtonProps> = ({
  className = '',
  onAddBack,
  onRemove,
  selected,
  stop,
}) => {
  const { t } = useTranslation();

  const allClasses = twMerge(
    'h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand',
    getHoverStyles(false, false),
    className,
  );

  if (selected) {
    return (
      <IconButton
        className={allClasses}
        tooltip={t('stopAreaDetails.memberStops.actionButtons.remove')}
        onClick={() => onRemove(stop.quay.netexId as string)}
        icon={<MdDelete className="text-2xl" aria-hidden />}
        testId={testIds.removeButton}
      />
    );
  }

  return (
    <IconButton
      className={allClasses}
      tooltip={t('stopAreaDetails.memberStops.actionButtons.addBack')}
      onClick={() => onAddBack(stopSearchRowToStopAreaFormMember(stop))}
      icon={<MdUndo className="text-2xl" aria-hidden />}
      testId={testIds.addBackButton}
    />
  );
};
