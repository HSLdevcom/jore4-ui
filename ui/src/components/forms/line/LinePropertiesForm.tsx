import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { Row } from '../../../layoutComponents';
import { AccordionButton } from '../../../uiComponents';
import {
  FormColumn,
  FormRow,
  InputField,
  localizedStringRequired,
  requiredString,
} from '../common';
import { LineTypeDropdown } from './LineTypeDropdown';
import { TransportTargetDropdown } from './TransportTargetDropdown';
import { VehicleModeDropdown } from './VehicleModeDropdown';

export const schema = z.object({
  label: requiredString,
  name: localizedStringRequired,
  shortName: localizedStringRequired,
  transportTarget: z.nativeEnum(HslRouteTransportTargetEnum),
  primaryVehicleMode: z.nativeEnum(ReusableComponentsVehicleModeEnum),
  typeOfLine: z.nativeEnum(RouteTypeOfLineEnum),
});

export type FormState = z.infer<typeof schema>;

const testIds = {
  form: 'LinePropertiesForm',
  label: 'LinePropertiesForm::label',
  showNameVersionsButton: 'LinePropertiesForm::showNameVersionsButton',
  finnishName: 'LinePropertiesForm::finnishName',
  swedishName: 'LinePropertiesForm::swedishName',
  finnishShortName: 'LinePropertiesForm::finnishShortName',
  swedishShortName: 'LinePropertiesForm::swedishShortName',
  transportTargetDropdown: 'LinePropertiesForm::transportTargetInput',
  vehicleModeDropdown: 'LinePropertiesForm::primaryVehicleModeInput',
  lineTypeDropdown: 'LinePropertiesForm::typeOfLineInput',
};
type LinePropertiesFormProps = {
  readonly className?: string;
};

export const LinePropertiesForm: FC<LinePropertiesFormProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const { getValues } = useFormContext<FormState>();

  // if either own of {Swedish name, Finnish short name, Swedish short name} are not defined, open
  // the "name versions" section by default
  const defaultShowNameVersions =
    !getValues('name.sv_FI') ||
    !getValues('shortName.fi_FI') ||
    !getValues('shortName.sv_FI');
  const [showNameVersions, setShowNameVersions] = useState<boolean>(
    defaultShowNameVersions,
  );

  return (
    <div data-testid={testIds.form} className={className}>
      <Row>
        <h2 className="mb-8">{t('lines.properties')}</h2>
      </Row>
      <FormColumn>
        <FormRow mdColumns={3}>
          <InputField<FormState>
            type="text"
            translationPrefix="lines"
            fieldPath="label"
            testId={testIds.label}
          />
        </FormRow>
        <FormRow mdColumns={3}>
          <InputField<FormState>
            type="text"
            className="col-span-2"
            translationPrefix="lines"
            fieldPath="name.fi_FI"
            testId={testIds.finnishName}
          />
        </FormRow>
        <Row className="items-center">
          <label
            htmlFor="showNameVersionsToggle"
            className="my-0 cursor-pointer text-base font-normal"
          >
            {t('lines.showNameVersions')}
            <AccordionButton
              identifier="showNameVersionsToggle"
              className="ml-1"
              isOpen={showNameVersions}
              onToggle={setShowNameVersions}
              testId={testIds.showNameVersionsButton}
              openTooltip={t('accessibility:lines.expandNameVersions')}
              closeTooltip={t('accessibility:lines.closeNameVersions')}
              controls="nameVersions"
            />
          </label>
        </Row>
        {showNameVersions && (
          <FormColumn id="nameVersions">
            <FormRow mdColumns={3}>
              <InputField<FormState>
                type="text"
                className="col-span-2"
                translationPrefix="lines"
                fieldPath="name.sv_FI"
                testId={testIds.swedishName}
              />
            </FormRow>
            <FormRow mdColumns={3}>
              <InputField<FormState>
                type="text"
                className="col-span-2"
                translationPrefix="lines"
                fieldPath="shortName.fi_FI"
                testId={testIds.finnishShortName}
              />
            </FormRow>
            <FormRow mdColumns={3}>
              <InputField<FormState>
                type="text"
                className="col-span-2"
                translationPrefix="lines"
                fieldPath="shortName.sv_FI"
                testId={testIds.swedishShortName}
              />
            </FormRow>
          </FormColumn>
        )}
        <FormRow mdColumns={3}>
          <InputField<FormState>
            translationPrefix="lines"
            fieldPath="transportTarget"
            testId={testIds.transportTargetDropdown}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <TransportTargetDropdown
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
          <InputField<FormState>
            translationPrefix="lines"
            fieldPath="primaryVehicleMode"
            testId={testIds.vehicleModeDropdown}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <VehicleModeDropdown
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
          <InputField<FormState>
            translationPrefix="lines"
            fieldPath="typeOfLine"
            testId={testIds.lineTypeDropdown}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <LineTypeDropdown
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
        </FormRow>
      </FormColumn>
    </div>
  );
};
