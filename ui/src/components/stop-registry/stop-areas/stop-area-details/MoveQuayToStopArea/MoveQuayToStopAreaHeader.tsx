import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedStopPlace } from '../../../../../types';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { MoveQuayToStopAreaModal } from './MoveQuayToStopAreaModal';

const testIds = {
  addStopButton: 'MemberStops::addStopButton',
};

type MoveQuayToStopAreaHeaderProps = {
  readonly area: EnrichedStopPlace;
  readonly refetch: () => Promise<unknown>;
};

export const MoveQuayToStopAreaHeader: FC<MoveQuayToStopAreaHeaderProps> = ({
  area,
  refetch,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!area.id || !area.privateCode?.value) {
    return null;
  }

  return (
    <>
      <div className="flex-grow" />

      <SlimSimpleButton
        type="button"
        onClick={handleOpenModal}
        inverted
        testId={testIds.addStopButton}
      >
        {t('stopAreaDetails.memberStops.moveStopToArea')}
      </SlimSimpleButton>

      <MoveQuayToStopAreaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCloseModal}
        areaId={area.id}
        areaPrivateCode={area.privateCode.value}
        refetch={refetch}
      />
    </>
  );
};
