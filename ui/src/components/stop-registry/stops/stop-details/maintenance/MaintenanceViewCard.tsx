import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
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

interface Props {
  stop: StopWithDetails;
}

export const MaintenanceViewCard = ({ stop }: Props): React.ReactElement => {
  const { t } = useTranslation();

  const maintainers = getMaintainers(stop);

  return (
    <div data-testid={testIds.container}>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-5">
        <MaintainerViewCard
          data-testid={testIds.owner}
          maintainer={maintainers.owner}
          title={t('stopDetails.maintenance.maintainers.owner')}
        />
        <MaintainerViewCard
          data-testid={testIds.maintenance}
          maintainer={maintainers.maintenance}
          title={t('stopDetails.maintenance.maintainers.maintenance')}
        />
        <MaintainerViewCard
          data-testid={testIds.winterMaintenance}
          maintainer={maintainers.winterMaintenance}
          title={t('stopDetails.maintenance.maintainers.winterMaintenance')}
        />
        <MaintainerViewCard
          data-testid={testIds.infoUpkeep}
          maintainer={maintainers.infoUpkeep}
          title={t('stopDetails.maintenance.maintainers.infoUpkeep')}
        />
        <MaintainerViewCard
          data-testid={testIds.cleaning}
          maintainer={maintainers.cleaning}
          title={t('stopDetails.maintenance.maintainers.cleaning')}
        />
      </div>
    </div>
  );
};
