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
import { TerminalDetailsEdit } from './basic-details-form/TerminalDetailsEdit';
import { TerminalDetailsView } from './TerminalDetailsViewCard';

export const TerminalDetails: FC<TerminalComponentProps> = ({
  terminal,
  className,
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
      className={className}
      colors={terminalInfoContainerColors}
      controls={infoContainerControls}
      title={t('terminalDetails.basicDetails.title')}
      testIdPrefix="TerminalDetailsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <TerminalDetailsEdit
          terminal={terminal}
          onFinishEditing={() => infoContainerControls.setIsInEditMode(false)}
          ref={formRef}
          onCancel={() => infoContainerControls.onCancel()}
          testIdPrefix="TerminalDetailsSection"
        />
      ) : (
        <TerminalDetailsView terminal={terminal} />
      )}
    </InfoContainer>
  );
};
