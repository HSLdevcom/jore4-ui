import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopSearchRow } from '../../types';
import { StopRowTdProps } from '../StopRowTdProps';
import { PriorityIcon } from './PriorityIcon';
import { PriorityVisualizationType } from './PriorityVisualizationType';
import { SideBar } from './SideBar';
import { useStopPriorityVisualizationType } from './useStopPriorityVisualizationType';

const testIds = {
  priorityTd: 'StopTableRow::priority',
};

function remainingValidityDays(validityEnd: DateTime | null | undefined) {
  // Logically should always be defined
  if (validityEnd) {
    const diff = validityEnd.diff(DateTime.now().startOf('day'), 'days');
    const days = diff.get('days');

    if (days >= 0) {
      return Math.floor(days);
    }

    return -1;
  }

  return Number.NaN;
}

function getAboutToEndTitle(
  t: TFunction,
  validityEnd: DateTime | null | undefined,
): string {
  const remainingDays = remainingValidityDays(validityEnd);

  if (remainingDays < 0) {
    return t('priority.alreadyEnded');
  }

  if (remainingDays === 0) {
    return t('priority.aboutToEndToday');
  }

  if (remainingDays === 1) {
    return t('priority.aboutToEndTomorrow');
  }

  return t('priority.aboutToEnd', {
    count: remainingValidityDays(validityEnd),
  });
}

function useTitle(
  type: PriorityVisualizationType,
  { validity_end: validityEnd }: StopSearchRow,
): string | undefined {
  const { t } = useTranslation();

  switch (type) {
    case PriorityVisualizationType.STANDARD:
      return t('priority.labelAndPriority', {
        priority: t('priority.standard'),
      });

    case PriorityVisualizationType.ABOUT_TO_END:
      return getAboutToEndTitle(t, validityEnd);

    case PriorityVisualizationType.TEMPORARY:
      return t('priority.labelAndPriority', {
        priority: t('priority.temporary'),
      });

    case PriorityVisualizationType.DRAFT:
      return t('priority.labelAndPriority', {
        priority: t('priority.draft'),
      });

    default:
      return undefined;
  }
}

export const PriorityTd: FC<StopRowTdProps> = ({ className, stop }) => {
  const visualizationType = useStopPriorityVisualizationType(stop);
  const title = useTitle(visualizationType, stop);

  return (
    <td
      className={twMerge('p-0', className)}
      data-testid={testIds.priorityTd}
      title={title}
    >
      <div className="flex h-full w-full items-stretch">
        <SideBar type={visualizationType} />
        <PriorityIcon type={visualizationType} />
      </div>
    </td>
  );
};
