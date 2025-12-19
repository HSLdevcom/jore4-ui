import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../../../utils';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { TerminalComponentProps } from '../../types';
import { OwnerDetailsEdit } from './OwnerDetailsEdit';
import { OwnerDetailsViewCard } from './OwnerDetailsViewCard';

export const OwnerDetailsSection: FC<TerminalComponentProps> = ({
  terminal,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);

  const rawInfoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
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
      {infoContainerControls.isInEditMode ? (
        <OwnerDetailsEdit
          terminal={terminal}
          onFinishEditing={() => infoContainerControls.setIsInEditMode(false)}
          ref={formRef}
          onCancel={() => infoContainerControls.onCancel()}
          testIdPrefix="TerminalOwnerDetailsSection"
        />
      ) : (
        <OwnerDetailsViewCard terminal={terminal} />
      )}
    </InfoContainer>
  );
};
