import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { TerminalComponentProps } from './TerminalVersioningRow';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../common';
import { submitFormByRef } from '../../../../utils';
import { theme } from '../../../../generated/theme';
import { TerminalDetailsView } from './TerminalDetailsView';

const testIds = {
  prefix: 'TerminalDetails',
  editPrefix: 'TerminalDetailsEdit',
};

export const TerminalDetails: FC<TerminalComponentProps> = ({
  terminal,
  className = '',
}) => {
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);
  const rawInfoContainerControls = useInfoContainerControls({
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const infoContainerControls: InfoContainerControls = {
    ...rawInfoContainerControls,
  };

  return (
    <InfoContainer
      className={twMerge('w-4/6', className)}
      colors={{
        backgroundColor: theme.colors.background.grey,
        borderColor: theme.colors.lightGrey,
      }}
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
