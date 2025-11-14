import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapStopOwnerToUiName } from '../../../../../i18n/uiNameMappings';

const testIds = {
  stopOwner: 'MaintenanceViewCard::stopOwner',
  stopOwnerName: 'MaintenanceViewCard::stopOwnerName',
  notSelectedPlaceholder: 'MaintenanceViewCard::notSelectedPlaceholder',
};

type StopOwnerViewCardProps = {
  readonly stopOwner: string | null;
};

export const StopOwnerViewCard: FC<StopOwnerViewCardProps> = ({
  stopOwner,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.stopOwner} className="text-sm">
      <h5 className="mb-2">
        {t('stopDetails.maintenance.maintainers.stopOwner')}
      </h5>
      {stopOwner ? (
        <div data-testid={testIds.stopOwnerName}>
          {mapStopOwnerToUiName(t, stopOwner) ?? ''}
        </div>
      ) : (
        <div data-testid={testIds.notSelectedPlaceholder}>-</div>
      )}
    </div>
  );
};
