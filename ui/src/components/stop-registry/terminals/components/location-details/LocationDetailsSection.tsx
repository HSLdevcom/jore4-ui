import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../../../utils';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { TerminalFormComponentProps } from '../../types';
import { TerminalLocationDetailsEdit } from './location-details-form/LocationDetailsEdit';
import { LocationDetailsView } from './LocationDetailsViewCard';

export const LocationDetails: FC<TerminalFormComponentProps> = ({
  terminal,
  refetch,
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
      title={t('terminalDetails.location.title')}
      testIdPrefix="TerminalLocationDetailsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <TerminalLocationDetailsEdit
          terminal={terminal}
          onFinishEditing={() => infoContainerControls.setIsInEditMode(false)}
          ref={formRef}
          refetch={refetch}
        />
      ) : (
        <LocationDetailsView terminal={terminal} />
      )}
    </InfoContainer>
  );
};
