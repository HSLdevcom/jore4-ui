import { FC } from 'react';
import { Control, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStopOwnerToUiName } from '../../../../../i18n/uiNameMappings';
import { StopOwner } from '../../../../../types/stop-registry';
import { EnumDropdown } from '../../../../forms/common/EnumDropdown';
import { MaintenanceDetailsFormState } from './schema';

const testIds = {
  stopOwner: 'MaintenanceDetailsForm::stopOwner',
};

type StopOwnerFormFieldProps = {
  readonly control: Control<MaintenanceDetailsFormState>;
};

export const StopOwnerFormField: FC<StopOwnerFormFieldProps> = ({
  control,
}) => {
  const { t } = useTranslation();

  const { field, fieldState } = useController<
    MaintenanceDetailsFormState,
    'stopOwner'
  >({
    name: 'stopOwner',
    control,
  });

  return (
    <div className="flex flex-col text-sm [&>label]:leading-8">
      <label htmlFor="stopOwner">
        {t('stopDetails.maintenance.maintainers.stopOwner')}
      </label>
      <EnumDropdown
        id="stopOwner"
        testId={testIds.stopOwner}
        enumType={StopOwner}
        uiNameMapper={(value) => mapStopOwnerToUiName(t, value)}
        placeholder="-"
        value={field.value ?? undefined}
        onChange={field.onChange}
        onBlur={field.onBlur}
        fieldState={fieldState}
      />
    </div>
  );
};
