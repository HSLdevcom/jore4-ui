import { useTranslation } from 'react-i18next';
import { FormColumn, FormRow, InputField } from '../common';
import { RouteFormState } from './RoutePropertiesForm.types';

const testIds = {
  originFinnishNameInput: 'terminusNamesForm:origin:finnishNameInput',
  originFinnishShortNameInput: 'terminusNamesForm:origin:finnishShortNameInput',
  originSwedishNameInput: 'terminusNamesForm:origin:swedishNameInput',
  originSwedishShortNameInput: 'terminusNamesForm:origin:swedishShortNameInput',
  destinationFinnishNameInput: 'terminusNamesForm:destination:finnishNameInput',
  destinationFinnishShortNameInput:
    'terminusNamesForm:destination:finnishShortNameInput',
  destinationSwedishNameInput: 'terminusNamesForm:destination:swedishNameInput',
  destinationSwedishShortNameInput:
    'terminusNamesForm:destination:swedishShortNameInput',
};

interface Props {
  className?: string;
}

export const TerminusNameInputs = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`${className} w-full`}>
      <h2 className="my-4 w-full pt-1 text-xl font-bold">
        {t('routes.origin.title')}
      </h2>
      <FormColumn>
        <FormRow columns={2}>
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
      <h2 className="my-4 w-full pt-1 text-xl font-bold">
        {t('routes.destination.title')}
      </h2>
      <FormColumn>
        <FormRow columns={2}>
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
