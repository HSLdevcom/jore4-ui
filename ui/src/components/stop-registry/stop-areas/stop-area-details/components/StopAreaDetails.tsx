import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { theme } from '../../../../../generated/theme';
import { submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { EditableStopAreaComponentProps } from './StopAreaComponentProps';
import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';
import { StopAreaDetailsView } from './StopAreaDetailsView';

const testIds = {
  prefix: 'StopAreaDetails',
};

export const StopAreaDetails: FC<EditableStopAreaComponentProps> = ({
  area,
  className = '',
  refetch,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);
  const infoContainerControls = useInfoContainerControls({
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  return (
    <InfoContainer
      className={twMerge('w-4/6', className)}
      colors={{
        backgroundColor: theme.colors.background.grey,
        borderColor: theme.colors.lightGrey,
      }}
      controls={infoContainerControls}
      title={t('stopAreaDetails.basicDetails.title')}
      testIdPrefix={testIds.prefix}
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
