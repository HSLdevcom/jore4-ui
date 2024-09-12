import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopAreaDetailsFragment } from '../../../../../generated/graphql';
import { theme } from '../../../../../generated/theme';
import { mapToShortDate } from '../../../../../time';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
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

  const infoContainerControls = useInfoContainerControls();

  return (
    <InfoContainer
      className={twMerge('w-4/6', className)}
      colors={{
        backgroundColor: theme.colors.background.grey,
        borderColor: theme.colors.lightGrey,
      }}
      controls={infoContainerControls}
      title={t('stopAreaDetails.basicDetails.title')}
    >
      <DetailRow className="mb-0 flex-grow flex-wrap py-0">
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
          title={t('stopAreaDetails.basicDetails.parentTerminal')}
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
    </InfoContainer>
  );
};
