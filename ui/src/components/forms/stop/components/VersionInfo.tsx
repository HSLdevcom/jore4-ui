import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormColumn,
  FormRow,
  PriorityForm,
  ReasonForChangeForm,
  ValidityPeriodForm,
} from '../../common';

const testIds = {
  container: 'StopFormComponent::VersionInfoContainer',
};

type VersionInfoProps = { readonly className?: string };

export const VersionInfo: FC<VersionInfoProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <FormColumn className={className} data-testid={testIds.container}>
      <h3>{t('stops.versionInfoTitle')}</h3>

      <FormRow>
        <ReasonForChangeForm />
      </FormRow>

      <FormRow>
        <PriorityForm />
      </FormRow>

      <ValidityPeriodForm dateInputRowClassName="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" />
    </FormColumn>
  );
};
