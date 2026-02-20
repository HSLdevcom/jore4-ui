import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopRegistryTransportModeType } from '../../../generated/graphql';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../i18n/uiNameMappings';
import { JoreStopRegistryTransportModeType } from '../../../types/stop-registry';
import { EnumDropdown, InputField } from '../../forms/common';
import { StopAreaFormState } from '../../forms/stop-area/stopAreaFormSchema';

const testId = 'StopAreaFormComponent::transportMode';

type TransportationModeFieldProps = {
  readonly availableTransportModes?: readonly JoreStopRegistryTransportModeType[];
  readonly loadingTransportModes?: boolean;
  readonly enableAutoSelect?: boolean;
};

export const TransportationModeField = ({
  availableTransportModes,
  loadingTransportModes,
  enableAutoSelect = true,
}: TransportationModeFieldProps) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<StopAreaFormState>();
  const isEditing = !!watch('id');
  const currentValue = watch('transportMode');

  // Auto-select if only one mode available and no value set yet and creating new stop area (not editing or copying)
  const shouldAutoSelect =
    enableAutoSelect &&
    !loadingTransportModes &&
    availableTransportModes &&
    availableTransportModes.length === 1 &&
    !currentValue &&
    !isEditing;

  // Use useEffect to call setValue instead of calling it during render
  useEffect(() => {
    if (shouldAutoSelect) {
      // Cast to StopRegistryTransportModeType since the values are compatible
      setValue(
        'transportMode',
        availableTransportModes[0] as unknown as StopRegistryTransportModeType,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  }, [shouldAutoSelect, setValue, availableTransportModes]);

  // Filter enum to only show available modes
  const filteredEnum = useMemo(() => {
    // When editing, show all modes
    if (isEditing) {
      return JoreStopRegistryTransportModeType;
    }

    // If loaded but no modes found, return empty enum (no options)
    if (!availableTransportModes || availableTransportModes.length === 0) {
      return {};
    }

    // Filter to only available modes
    return availableTransportModes.reduce<
      Record<string, JoreStopRegistryTransportModeType>
    >((acc, mode) => {
      return { ...acc, [mode]: mode };
    }, {});
  }, [isEditing, availableTransportModes]);

  // Determine placeholder text
  const placeholder = useMemo(() => {
    if (isEditing) {
      return t('common.chooseFrom');
    }
    if (loadingTransportModes) {
      return t('loading');
    }
    if (!availableTransportModes || availableTransportModes.length === 0) {
      return t('stopArea.noNearbyNetworks');
    }
    return t('common.chooseFrom');
  }, [isEditing, loadingTransportModes, availableTransportModes, t]);

  return (
    <InputField<StopAreaFormState>
      translationPrefix="stopArea"
      fieldPath="transportMode"
      testId={testId}
      // eslint-disable-next-line react/no-unstable-nested-components
      inputElementRenderer={(props) => (
        <EnumDropdown<JoreStopRegistryTransportModeType>
          enumType={filteredEnum}
          placeholder={placeholder}
          uiNameMapper={(value) =>
            mapStopRegistryTransportModeTypeToUiName(t, value)
          }
          disabled={isEditing || loadingTransportModes}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      )}
    />
  );
};
