import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../../time';
import { EnrichedStopPlace } from '../../../../../../types';

const testIds = {
  names: 'CopyStopAreaModal::names',
  validity: 'CopyStopAreaModal::validity',
};

type CopyStopAreaBoilerplateProps = {
  readonly stopArea: EnrichedStopPlace;
};

export const CopyStopAreaBoilerplate: FC<CopyStopAreaBoilerplateProps> = ({
  stopArea,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-[550px] flex-col gap-4 bg-hsl-neutral-blue p-4">
      <p>{t('stopAreaDetails.version.copy.boilerplate')}</p>
      <div className="flex flex-col">
        <p className="font-bold" data-testid={testIds.names}>
          <span>{stopArea.privateCode?.value}</span>{' '}
          <span>{stopArea.name ?? '-'}</span>
          <span className="mx-2">|</span>
          <span>{stopArea.nameSwe ?? '-'}</span>
        </p>
        <p data-testid={testIds.validity}>
          <span>
            {mapToShortDate(stopArea.validityStart)}
            <span className="mx-1">-</span>
            {mapToShortDate(stopArea.validityEnd)}
          </span>
        </p>
      </div>
    </div>
  );
};
