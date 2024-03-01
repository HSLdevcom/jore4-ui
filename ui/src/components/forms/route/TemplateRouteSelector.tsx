import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { ValueFn } from '../../../uiComponents';
import {
  ObservationDateInput,
  PriorityForm,
  PriorityFormState,
  priorityFormSchema,
} from '../common';
import { ChooseRouteDropdown } from './ChooseRouteDropdown';

interface Props {
  value?: UUID;
  onChange: ValueFn;
}

const testIds = {
  container: 'TemplateRouteSelector::container',
  observationDateInput: 'TemplateRouteSelector::observationDateInput',
  chooseRouteDropdown: 'TemplateRouteSelector::chooseRouteDropdown',
};

export const TemplateRouteSelector = ({
  value,
  onChange,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  // PriorityForm uses a FormState.
  // However our parent component already has one with "priority" field,
  // which we don't want to mess with, so need to create a new one.
  const methods = useForm<PriorityFormState>({
    values: {
      priority: Priority.Standard,
    },
    resolver: zodResolver(priorityFormSchema),
  });

  const [observationDate, setObservationDate] = useState(DateTime.now());

  return (
    <div
      data-testid={testIds.container}
      className="prelative relative w-full rounded-md border border-light-grey bg-background px-3 py-4"
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...methods}>
        <h3 className="mb-4">{t('routes.searchTemplate')}</h3>
        <Row className="mb-4">
          <PriorityForm hiddenPriorities={[]} />
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
            priorities={[methods.getValues('priority')]}
            testId={testIds.chooseRouteDropdown}
          />
        </Row>
      </FormProvider>
    </div>
  );
};
