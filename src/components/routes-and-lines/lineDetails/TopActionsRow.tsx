import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useGetLineDetails } from '../../../hooks/lineDetails/useGetLineDetails';
import { Column, Container, Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';

export const TopActionsRow = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { observationDate } = useGetLineDetails();

  const onDateChange = (date: DateTime) => {
    const queryString = date.isValid
      ? `selectedDate=${date.toISODate()}`
      : `showAll=true`;

    history.push({
      search: `?${queryString}`,
    });
  };

  return (
    <Container className={`pt-4 pb-0 ${className}`}>
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
