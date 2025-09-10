import { FC } from 'react';
import { DateInputField } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { ClassNameProps } from '../Types/ClassNameProps';

export const ObservationDateFilter: FC<ClassNameProps> = ({ className }) => (
  <DateInputField<StopSearchFilters>
    className={className}
    inputClassName="flex-grow"
    fieldPath="observationDate"
    testId={stopSearchBarTestIds.observationDateInput}
    translationPrefix="filters"
  />
);
