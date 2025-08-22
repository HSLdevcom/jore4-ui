import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapLngLatToPoint } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { TerminalInfoSpotsViewList } from './TerminalInfoSpotsViewList';
import { TerminalInfoSpotsSectionProps } from './types';

export const TerminalInfoSpotsSection: FC<TerminalInfoSpotsSectionProps> = ({
  terminal,
  infoSpots,
}) => {
  const { t } = useTranslation();

  const location = mapLngLatToPoint([
    terminal.locationLong ?? 0,
    terminal.locationLat ?? 0,
  ]);

  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
  });

  return (
    <InfoContainer
      colors={terminalInfoContainerColors}
      bodyClassName="p-0"
      controls={infoContainerControls}
      headerButtons={undefined}
      title={t('terminalDetails.infoSpots.title')}
      testIdPrefix="TerminalInfoSpotsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <p>TODO</p>
      ) : (
        <TerminalInfoSpotsViewList
          infoSpots={infoSpots}
          location={location}
          terminal={terminal}
        />
      )}
    </InfoContainer>
  );
};
