import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { TerminalComponentProps } from '../../types';
import { TerminalDetailsView } from './TerminalDetailsViewCard';

const testIds = {
  prefix: 'TerminalDetailsSection',
  editPrefix: 'TerminalDetailsEditSection',
};

export const TerminalDetails: FC<TerminalComponentProps> = ({
  terminal,
  className = '',
}) => {
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
      className={className}
      colors={terminalInfoContainerColors}
      controls={infoContainerControls}
      title={t('terminalDetails.basicDetails.title')}
      testIdPrefix={
        infoContainerControls.isInEditMode ? testIds.editPrefix : testIds.prefix
      }
    >
      <TerminalDetailsView terminal={terminal} />
    </InfoContainer>
  );
};
