import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/Priority';
import { SimpleButton, ValueFn } from '../../../uiComponents';
import { ChooseRouteDropdown } from './ChooseRouteDropdown';

interface Props {
  value?: UUID;
  onChange: ValueFn;
}

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
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>{t('priority.label')}</label>
          <Row className="space-x-1">
            <SimpleButton
              onClick={() => setPriority(Priority.Standard)}
              inverted={priority !== Priority.Standard}
            >
              {t('priority.standard')}
            </SimpleButton>
            <SimpleButton
              onClick={() => setPriority(Priority.Draft)}
              inverted={priority !== Priority.Draft}
            >
              {t('priority.draft')}
            </SimpleButton>
            <SimpleButton
              onClick={() => setPriority(Priority.Temporary)}
              inverted={priority !== Priority.Temporary}
            >
              {t('priority.temporary')}
            </SimpleButton>
          </Row>
        </Column>
      </Row>
      <Column className="mb-4">
        <label htmlFor="template-route-observation-date">
          {t('filters.observationDate')}
        </label>
        <input
          id="template-route-observation-date"
          type="date"
          value={observationDate.toISODate()}
          onChange={(e) => setObservationDate(DateTime.fromISO(e.target.value))}
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
        />
      </Row>
    </div>
  );
};
