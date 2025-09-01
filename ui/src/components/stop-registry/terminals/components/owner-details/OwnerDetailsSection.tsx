import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { TerminalComponentProps } from '../../types';
import { OwnerDetailsViewCard } from './OwnerDetailsViewCard';

export const OwnerDetailsSection: FC<TerminalComponentProps> = ({
  terminal,
}) => {
  const { t } = useTranslation();

  const rawInfoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: false,
  });

  const infoContainerControls: InfoContainerControls = {
    ...rawInfoContainerControls,
  };

  return (
    <InfoContainer
      colors={terminalInfoContainerColors}
      controls={infoContainerControls}
      title={t('terminalDetails.owner.title')}
      testIdPrefix="TerminalOwnerDetailsSection"
    >
      <OwnerDetailsViewCard terminal={terminal} />
    </InfoContainer>
  );
};
