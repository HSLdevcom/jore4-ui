import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';
import { StringInput } from '../common/StringInput';
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
      <h2 className="w-full pt-1 text-xl font-bold">
        {t('routes.origin.title')}
      </h2>
      <Row className="mt-5 flex-wrap gap-2">
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="origin.name.fi_FI"
            testId={testIds.originFinnishNameInput}
          />
        </Column>
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="origin.shortName.fi_FI"
            testId={testIds.originFinnishShortNameInput}
          />
        </Column>
      </Row>
      <Row className="mt-5 flex-wrap gap-2">
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="origin.name.sv_FI"
            testId={testIds.originSwedishNameInput}
          />
        </Column>
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="origin.shortName.sv_FI"
            testId={testIds.originSwedishShortNameInput}
          />
        </Column>
      </Row>
      <h2 className="w-full pt-1 text-xl font-bold">
        {t('routes.destination.title')}
      </h2>
      <Row className="mt-5 flex-wrap gap-2">
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="destination.name.fi_FI"
            testId={testIds.destinationFinnishNameInput}
          />
        </Column>
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="destination.shortName.fi_FI"
            testId={testIds.destinationFinnishShortNameInput}
          />
        </Column>
      </Row>
      <Row className="mt-5 flex-wrap gap-2">
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="destination.name.sv_FI"
            testId={testIds.destinationSwedishNameInput}
          />
        </Column>
        <Column className="w-80 flex-auto">
          <StringInput<RouteFormState>
            translationPrefix="routes"
            fieldPath="destination.shortName.sv_FI"
            testId={testIds.destinationSwedishShortNameInput}
          />
        </Column>
      </Row>
    </div>
  );
};
