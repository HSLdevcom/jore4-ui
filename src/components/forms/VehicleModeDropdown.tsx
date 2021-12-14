import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { FormInputProps, Listbox } from '../../uiComponents';

// It seems to be impossible to process enumerations in the way done here in a type safe way,
// at least without using 'as' in many places (which in itself isn't type safe). Therefore,
// this was implemented by processing the ReusableComponentsVehicleModeEnum values as strings.

const translateVehicleMode = (t: TFunction, item: string) =>
  t(`vehicleModeEnum.${item}`);

const mapToOption = (t: TFunction, item: string) => ({
  key: item,
  value: item,
  render: function VehicleModeOption() {
    return (
      <div className="cursor-default">
        <div className="ml-2 mr-2">{translateVehicleMode(t, item)}</div>
      </div>
    );
  },
});

interface Props extends FormInputProps {
  id?: string;
}

export const VehicleModeDropdown = ({
  id,
  value,
  onChange,
  onBlur,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const options = Object.values(ReusableComponentsVehicleModeEnum).map((item) =>
    mapToOption(t, item),
  );

  return (
    <Listbox
      id={id || 'vehicle-mode-dropdown'}
      buttonContent={
        value ? translateVehicleMode(t, value) : t('lines.chooseVehicleMode')
      }
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
