import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { SimpleButton, ValueFn } from '../../../uiComponents';
import { ObservationDateInput } from '../common';
import { ChooseRouteDropdown } from './ChooseRouteDropdown';

interface Props {
  value?: UUID;
  onChange: ValueFn;
}

const testIds = {
  standardPriorityButton: `TemplateRouteSelector::standardPriorityButton`,
  draftPriorityButton: `TemplateRouteSelector::draftPriorityButton`,
  temporaryPriorityButton: `TemplateRouteSelector::temporaryPriorityButton`,
  observationDateInput: 'TemplateRouteSelector::observationDateInput',
  chooseRouteDropdown: 'TemplateRouteSelector::chooseRouteDropdown',
};

export const TemplateRouteSelector = ({
  value,
  onChange,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [priority, setPriority] = useState(Priority.Standard);
  const [observationDate, setObservationDate] = useState(DateTime.now());

  return (
    <div className="prelative relative w-full rounded-md border border-light-grey bg-background px-3 py-4">
      <h3 className="mb-4">{t('routes.searchTemplate')}</h3>
      <Row className="mb-4">
        <Column>
          <fieldset>
            <legend className="font-bold">{t('priority.label')}</legend>
            <Row className="space-x-1">
              <SimpleButton
                onClick={() => setPriority(Priority.Standard)}
                inverted={priority !== Priority.Standard}
                testId={testIds.standardPriorityButton}
              >
                {t('priority.standard')}
              </SimpleButton>
              <SimpleButton
                onClick={() => setPriority(Priority.Draft)}
                inverted={priority !== Priority.Draft}
                testId={testIds.draftPriorityButton}
              >
                {t('priority.draft')}
              </SimpleButton>
              <SimpleButton
                onClick={() => setPriority(Priority.Temporary)}
                inverted={priority !== Priority.Temporary}
                testId={testIds.temporaryPriorityButton}
              >
                {t('priority.temporary')}
              </SimpleButton>
            </Row>
          </fieldset>
        </Column>
      </Row>
      <Column className="mb-4">
        <ObservationDateInput
          value={observationDate}
          onChange={setObservationDate}
          testId={testIds.observationDateInput}
          className="flex-1"
        />
      </Column>
      <label htmlFor="choose-route-combobox">{t('routes.label')}</label>
      <Row className="mb-4">
        <ChooseRouteDropdown
          value={value}
          onChange={onChange}
          date={observationDate}
          priorities={[priority]}
          testId={testIds.chooseRouteDropdown}
        />
      </Row>
    </div>
  );
};
