import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { TerminalComponentProps } from '../../types';
import { LocationDetailsView } from './LocationDetailsViewCard';

export const LocationDetails: FC<TerminalComponentProps> = ({ terminal }) => {
  const { t } = useTranslation();

  const rawInfoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
  });

  const infoContainerControls: InfoContainerControls = {
    ...rawInfoContainerControls,
  };

  return (
    <InfoContainer
      colors={terminalInfoContainerColors}
      controls={infoContainerControls}
      title={t('terminalDetails.location.title')}
      testIdPrefix="LocationDetailsSection"
    >
      <LocationDetailsView terminal={terminal} />
    </InfoContainer>
  );
};
