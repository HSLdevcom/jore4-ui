import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { theme } from '../../../../../generated/theme';
import { submitFormByRef } from '../../../../../utils';
import {
  InfoContainer,
  InfoContainerControls,
  useInfoContainerControls,
} from '../../../../common';
import { EditableStopAreaComponentProps } from '../types';
import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';
import { StopAreaDetailsView } from './StopAreaDetailsView';

const testIds = {
  prefix: 'StopAreaDetails',
  editPrefix: 'StopAreaDetailsEdit',
};

function getContainerColors(
  mode: StopRegistryTransportModeType | null | undefined,
) {
  switch (mode) {
    case StopRegistryTransportModeType.Tram:
      return {
        backgroundColor: theme.colors.hslTramDarkGreen,
        borderColor: theme.colors.border.hslTramGreen,
        textColorClassName: 'text-white',
      };
    default:
      return {
        backgroundColor: theme.colors.tweakedBrand,
        borderColor: theme.colors.border.hslBlue,
        textColorClassName: 'text-white',
      };
  }
}

export const StopAreaDetails: FC<EditableStopAreaComponentProps> = ({
  area,
  className,
  refetch,
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

  const containerColors = getContainerColors(area.transportMode);

  return (
    <InfoContainer
      className={twMerge('w-4/6', className)}
      colors={containerColors}
      controls={infoContainerControls}
      title={t('stopAreaDetails.basicDetails.title')}
      testIdPrefix={
        infoContainerControls.isInEditMode ? testIds.editPrefix : testIds.prefix
      }
      inverted
    >
      {infoContainerControls.isInEditMode ? (
        <StopAreaDetailsEdit
          area={area}
          ref={formRef}
          refetch={refetch}
          onFinishEditing={() => infoContainerControls.setIsInEditMode(false)}
          onCancel={() => infoContainerControls.onCancel()}
          testIdPrefix={testIds.editPrefix}
        />
      ) : (
        <StopAreaDetailsView area={area} />
      )}
    </InfoContainer>
  );
};
