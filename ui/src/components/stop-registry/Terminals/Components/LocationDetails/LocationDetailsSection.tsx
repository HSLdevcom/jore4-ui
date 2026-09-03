import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../../../utils';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common/InfoContainer';
import { TerminalComponentProps } from '../../Types';
import { terminalInfoContainerColors } from '../../Utils/terminalInfoContainerColors';
import { TerminalLocationDetailsEdit } from './Edit/LocationDetailsEdit';
import { LocationDetailsView } from './LocationDetailsViewCard';

export const LocationDetails: FC<TerminalComponentProps> = ({ terminal }) => {
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
      title={t(($) => $.terminalDetails.location.title)}
      ariaLabel={t(($) => $.terminalDetails.location.title)}
      testIdPrefix="TerminalLocationDetailsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <TerminalLocationDetailsEdit
          terminal={terminal}
          onFinishEditing={() => infoContainerControls.setIsInEditMode(false)}
          ref={formRef}
          onCancel={() => infoContainerControls.onCancel()}
          testIdPrefix="TerminalLocationDetailsSection"
        />
      ) : (
        <LocationDetailsView terminal={terminal} />
      )}
    </InfoContainer>
  );
};
