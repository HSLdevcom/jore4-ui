import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormColumn, FormRow, InputField } from '../common';
import { RouteFormState } from './RoutePropertiesForm.types';

const testIds = {
  originFinnishNameInput: 'TerminusNameInputs::origin::finnishNameInput',
  originFinnishShortNameInput:
    'TerminusNameInputs::origin::finnishShortNameInput',
  originSwedishNameInput: 'TerminusNameInputs::origin::swedishNameInput',
  originSwedishShortNameInput:
    'TerminusNameInputs::origin::swedishShortNameInput',
  destinationFinnishNameInput:
    'TerminusNameInputs::destination::finnishNameInput',
  destinationFinnishShortNameInput:
    'TerminusNameInputs::destination::finnishShortNameInput',
  destinationSwedishNameInput:
    'TerminusNameInputs::destination::swedishNameInput',
  destinationSwedishShortNameInput:
    'TerminusNameInputs::destination::swedishShortNameInput',
};

type TerminusNameInputsProps = {
  readonly className?: string;
};

export const TerminusNameInputs: FC<TerminusNameInputsProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  return (
    <div className={`${className} w-full px-4`}>
      <h3 className="my-4 w-full pt-1">{t('routes.origin.title')}</h3>
      <FormColumn>
        <FormRow mdColumns={2}>
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="origin.name.fi_FI"
            testId={testIds.originFinnishNameInput}
          />
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="origin.shortName.fi_FI"
            testId={testIds.originFinnishShortNameInput}
          />
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="origin.name.sv_FI"
            testId={testIds.originSwedishNameInput}
          />
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="origin.shortName.sv_FI"
            testId={testIds.originSwedishShortNameInput}
          />
        </FormRow>
      </FormColumn>
      <h3 className="my-4 w-full pt-1">{t('routes.destination.title')}</h3>
      <FormColumn>
        <FormRow mdColumns={2}>
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="destination.name.fi_FI"
            testId={testIds.destinationFinnishNameInput}
          />
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="destination.shortName.fi_FI"
            testId={testIds.destinationFinnishShortNameInput}
          />
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="destination.name.sv_FI"
            testId={testIds.destinationSwedishNameInput}
          />
          <InputField<RouteFormState>
            type="text"
            translationPrefix="routes"
            fieldPath="destination.shortName.sv_FI"
            testId={testIds.destinationSwedishShortNameInput}
          />
        </FormRow>
      </FormColumn>
    </div>
  );
};
