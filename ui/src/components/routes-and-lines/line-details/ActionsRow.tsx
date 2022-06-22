import produce from 'immer';
import { DateTime } from 'luxon';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { RouteLine } from '../../../generated/graphql';
import { useGetLineDetails, useUrlQuery } from '../../../hooks';
import { Column, Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';

const getDraftsUrlWithReturnToQueryString = (line: RouteLine) => {
  const draftUrl = routeDetails[Path.lineDrafts].getLink(line.label);
  const returnToQueryString = qs.stringify({ returnTo: line.line_id });

  return `${draftUrl}?${returnToQueryString}`;
};

export const ActionsRow = ({
  className = '',
}: {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryParams = useUrlQuery();

  const { line, observationDate } = useGetLineDetails();

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

        {line && (
          <SimpleButton
            containerClassName="ml-auto"
            inverted
            href={getDraftsUrlWithReturnToQueryString(line)}
          >
            {t('lines.showDrafts')}
          </SimpleButton>
        )}
      </Row>
    </Container>
  );
};
