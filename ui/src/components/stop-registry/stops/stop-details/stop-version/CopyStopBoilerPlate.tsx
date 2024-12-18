import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
import { mapPriorityToUiName } from '../../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../../time';

type CopyStopBoilerPlateProps = {
  readonly originalStop: StopWithDetails;
};

export const CopyStopBoilerPlate: FC<CopyStopBoilerPlateProps> = ({
  originalStop,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-[550px] bg-hsl-neutral-blue p-4">
      <p>{t('stopDetails.version.copyBoilerPlate')}</p>
      <p className="mt-1 font-bold">
        <span>{originalStop.label}</span>{' '}
        <span>{originalStop.stop_place?.nameFin ?? '-'}</span>
        <span className="mx-2">|</span>
        <span>{originalStop.stop_place?.nameSwe ?? '-'}</span>
      </p>
      <p className="mt-1">
        <span className="font-bold">
          {mapPriorityToUiName(originalStop.priority)}
        </span>
        <span className="mx-2">|</span>
        <span>
          {mapToShortDate(originalStop.validity_start)}
          <span className="mx-1">-</span>
          {mapToShortDate(originalStop.validity_end)}
        </span>
      </p>
    </div>
  );
};
