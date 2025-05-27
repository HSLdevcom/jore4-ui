import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import { MaintainerViewCard } from './MaintainerViewCard';
import { getMaintainers } from './utils';

const testIds = {
  container: 'MaintenanceViewCard::container',
  owner: 'MaintenanceViewCard::owner',
  maintenance: 'MaintenanceViewCard::maintenance',
  winterMaintenance: 'MaintenanceViewCard::winterMaintenance',
  infoUpkeep: 'MaintenanceViewCard::infoUpkeep',
  cleaning: 'MaintenanceViewCard::cleaning',
};

type MaintenanceViewCardProps = {
  readonly stop: StopWithDetails;
};

export const MaintenanceViewCard: FC<MaintenanceViewCardProps> = ({ stop }) => {
  const { t } = useTranslation();

  const maintainers = getMaintainers(stop);

  return (
    <div data-testid={testIds.container}>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-5">
        <MaintainerViewCard
          testId={testIds.owner}
          maintainer={maintainers.owner}
          title={t('stopDetails.maintenance.maintainers.owner')}
        />
        <MaintainerViewCard
          testId={testIds.maintenance}
          maintainer={maintainers.maintenance}
          title={t('stopDetails.maintenance.maintainers.maintenance')}
        />
        <MaintainerViewCard
          testId={testIds.winterMaintenance}
          maintainer={maintainers.winterMaintenance}
          title={t('stopDetails.maintenance.maintainers.winterMaintenance')}
        />
        <MaintainerViewCard
          testId={testIds.infoUpkeep}
          maintainer={maintainers.infoUpkeep}
          title={t('stopDetails.maintenance.maintainers.infoUpkeep')}
        />
        <MaintainerViewCard
          testId={testIds.cleaning}
          maintainer={maintainers.cleaning}
          title={t('stopDetails.maintenance.maintainers.cleaning')}
        />
      </div>
    </div>
  );
};
