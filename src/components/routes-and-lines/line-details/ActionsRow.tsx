import produce from 'immer';
import { DateTime } from 'luxon';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useUrlQuery } from '../../../hooks';
import { useGetLineDetails } from '../../../hooks/line-details/useGetLineDetails';
import { Column, Container, Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';

export const ActionsRow = ({ className = '' }: { className?: string }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryParams = useUrlQuery();

  const { observationDate } = useGetLineDetails();

  const onDateChange = (date: DateTime) => {
    const updatedUrlQuery = produce(queryParams, (draft) => {
      if (date.isValid) {
        draft.selectedDate = date.toISODate();
        delete draft.showAll;
      } else {
        draft.showAll = true.toString();
        delete draft.selectedDate;
      }
    });

    const queryString = qs.stringify(updatedUrlQuery);
    history.push({
      search: `?${queryString}`,
    });
  };

  return (
    <Container className={className}>
      <Row>
        <h2 className="text-sm font-bold">{t('filters.observationDate')}</h2>
      </Row>
      <Row>
        <Column className="w-1/4">
          <input
            type="date"
            value={observationDate?.toISODate() || ''}
            onChange={(e) => onDateChange(DateTime.fromISO(e.target.value))}
            className="flex-1"
          />
        </Column>
        <SimpleButton
          className="ml-auto"
          inverted
          disabled
          onClick={() => console.log('TODO')} // eslint-disable-line no-console
        >
          {t('lines.showDrafts')}
        </SimpleButton>
      </Row>
    </Container>
  );
};
