import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PriorityForm,
  ReasonForChangeForm,
  ValidityPeriodForm,
} from '../../../../common/Forms';
import { FormColumn, FormRow } from '../../../../common/LayoutComponents';

const testIds = {
  container: 'StopFormComponent::VersionInfoContainer',
};

type VersionInfoProps = {
  readonly className?: string;
  readonly validityError?: ReactNode;
};

export const VersionInfo: FC<VersionInfoProps> = ({
  className,
  validityError,
}) => {
  const { t } = useTranslation();

  return (
    <FormColumn className={className} data-testid={testIds.container}>
      <h3>{t(($) => $.stops.versionInfoTitle)}</h3>
      <FormRow>
        <ReasonForChangeForm />
      </FormRow>
      <FormRow>
        <PriorityForm />
      </FormRow>
      <ValidityPeriodForm dateInputRowClassName="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" />
      {validityError}
    </FormColumn>
  );
};
