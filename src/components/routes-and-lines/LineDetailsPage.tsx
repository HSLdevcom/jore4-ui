import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetLineDetailsByIdQuery } from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql/route';
import { Container } from '../../layoutComponents';
import { mapToVariables } from '../../utils';
import { PageHeader } from './PageHeader';

export const LineDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);

  return (
    <div>
      <PageHeader>
        <i className="icon-bus-alt text-tweaked-brand text-5xl" />
        <h1 className="text-5xl font-bold">
          {t('lines.line')} {line?.label}
        </h1>
      </PageHeader>
      <Container>TODO</Container>
    </div>
  );
};
