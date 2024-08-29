import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopAreaDetailsFragment } from '../../../../../generated/graphql';
import { mapToShortDate } from '../../../../../time';
import {
  DetailRow,
  LabeledDetail,
  SlimSimpleButton,
} from '../../../stops/stop-details/layout';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  prefix: 'StopAreaDetails',
  editButton: 'StopAreaDetails::editButton',
  name: 'StopAreaDetails::name',
  description: 'StopAreaDetails::description',
  parentStopPlace: 'StopAreaDetails::parentStopPlace',
  areaSize: 'StopAreaDetails::areaSize',
  validityPeriod: 'StopAreaDetails::validityPeriod',
};

function validityPeriod(area: StopAreaDetailsFragment) {
  const from = mapToShortDate(area.validBetween?.fromDate);
  const to = mapToShortDate(area.validBetween?.toDate);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (from || to) {
    return `${from ?? ''}-${to ?? ''}`;
  }

  return null;
}

export const StopAreaDetails: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('flex w-4/6 flex-col items-stretch', className)}>
      <div className="flex items-center justify-between rounded-t border bg-background px-4 py-2">
        <h4>{t('stopAreaDetails.basicDetails.title')}</h4>
        <SlimSimpleButton disabled onClick={noop} testId={testIds.editButton}>
          {t('stopAreaDetails.basicDetails.edit')}
        </SlimSimpleButton>
      </div>

      <DetailRow className="!mb-0 flex-grow flex-wrap rounded-b border border-t-0 px-4 py-2">
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.name')}
          detail={area.name?.value}
          testId={testIds.name}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.description')}
          detail={area.description?.value}
          testId={testIds.description}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.parentStopPlace')}
          detail={null}
          testId={testIds.parentStopPlace}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.areaSize')}
          detail={null}
          testId={testIds.areaSize}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.validityPeriod')}
          detail={validityPeriod(area)}
          testId={testIds.validityPeriod}
        />
      </DetailRow>
    </div>
  );
};
