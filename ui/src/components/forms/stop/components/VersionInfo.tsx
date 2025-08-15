import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormColumn,
  FormRow,
  InputField,
  PriorityForm,
  ValidityPeriodForm,
} from '../../common';
import { StopFormState } from '../types';

const testIds = {
  container: 'StopFormComponent::VersionInfoContainer',
  versionName: 'StopFormComponent::versionName',
  versionDescription: 'StopFormComponent::versionDescription',
};

type VersionInfoProps = { readonly className?: string };

export const VersionInfo: FC<VersionInfoProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <FormColumn className={className} data-testid={testIds.container}>
      <h3>{t('stops.versionInfoTitle')}</h3>

      <FormRow>
        <InputField<StopFormState>
          type="text"
          translationPrefix="stopDetails.version.fields"
          fieldPath="versionName"
          testId={testIds.versionName}
        />
      </FormRow>

      <FormRow>
        <InputField<StopFormState>
          type="textarea"
          rows={2}
          translationPrefix="stopDetails.version.fields"
          fieldPath="versionDescription"
          testId={testIds.versionDescription}
        />
      </FormRow>

      <FormRow>
        <PriorityForm />
      </FormRow>

      <ValidityPeriodForm dateInputRowClassName="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" />
    </FormColumn>
  );
};
