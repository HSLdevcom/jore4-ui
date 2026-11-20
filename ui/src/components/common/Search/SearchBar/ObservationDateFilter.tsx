import { FC } from 'react';
import { DateInputField } from '../../Inputs';

type ObservationDateFilterForm = {
  readonly observationDate: Temporal.PlainDate;
};

type ObservationDateFilterProps = {
  readonly className?: string;
  readonly testId: string;
};

export const ObservationDateFilter: FC<ObservationDateFilterProps> = ({
  className,
  testId,
}) => (
  <DateInputField<ObservationDateFilterForm>
    className={className}
    inputClassName="grow"
    fieldPath="observationDate"
    testId={testId}
    translationPrefix="filters"
  />
);
