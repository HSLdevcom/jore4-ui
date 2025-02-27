import { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { theme } from '../../../../../generated/theme';
import { submitFormByRef } from '../../../../../utils';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';
import { EditableStopAreaComponentProps } from '../types';
import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';
import { StopAreaDetailsView } from './StopAreaDetailsView';

const testIds = {
  prefix: 'StopAreaDetails',
  editPrefix: 'StopAreaDetailsEdit',
};

export const StopAreaDetails: FC<EditableStopAreaComponentProps> = ({
  area,
  className = '',
  blockInEdit,
  onEditBlock,
  refetch,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);
  const rawInfoContainerControls = useInfoContainerControls({
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  useEffect(() => {
    onEditBlock(
      rawInfoContainerControls.isInEditMode
        ? StopAreaEditableBlock.DETAILS
        : null,
    );
  }, [rawInfoContainerControls.isInEditMode, onEditBlock]);

  const infoContainerControls: InfoContainerControls = {
    ...rawInfoContainerControls,
    isEditable:
      blockInEdit === StopAreaEditableBlock.DETAILS || blockInEdit === null,
    isInEditMode: blockInEdit === StopAreaEditableBlock.DETAILS,
  };

  return (
    <InfoContainer
      className={twMerge('w-4/6', className)}
      colors={{
        backgroundColor: theme.colors.background.grey,
        borderColor: theme.colors.lightGrey,
      }}
      controls={infoContainerControls}
      title={t('stopAreaDetails.basicDetails.title')}
      testIdPrefix={
        infoContainerControls.isInEditMode ? testIds.editPrefix : testIds.prefix
      }
    >
      {infoContainerControls.isInEditMode ? (
        <StopAreaDetailsEdit
          area={area}
          onFinishEditing={() => infoContainerControls.setIsInEditMode(false)}
          ref={formRef}
          refetch={refetch}
        />
      ) : (
        <StopAreaDetailsView area={area} />
      )}
    </InfoContainer>
  );
};
