import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { RouteLine, useGetLineDetailsByIdQuery } from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql/route';
import { Column, Container, Row } from '../../layoutComponents';
import { mapToShortDate } from '../../time';
import { mapToVariables } from '../../utils';
import { AdditionalInformation } from './AdditionalInformation';
import { MapPreview } from './MapPreview';
import { PageHeader } from './PageHeader';

export const LineDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);

  const buildLineTitle = (label?: string) => `${t('lines.line')} ${label}`;
  const buildValidityPeriod = (validityStart?: string, validityEnd?: string) =>
    `${mapToShortDate(validityStart)} - ${mapToShortDate(validityEnd)}`;

  return (
    <>
      <PageHeader>
        <Row>
          <Column>
            <i className="icon-bus-alt text-tweaked-brand text-5xl" />
          </Column>
          <Column>
            <h1 className="text-5xl font-bold">
              {buildLineTitle(line?.label)}
            </h1>
            {line?.name_i18n}
            <Row>
              <i className="icon-time2 text-tweaked-brand text-xl" />
              {buildValidityPeriod(line?.validity_start, line?.validity_end)}
            </Row>
          </Column>
        </Row>
      </PageHeader>
      <Container>
        <Row>
          {line && (
            <AdditionalInformation className="w-2/3" line={line as RouteLine} />
          )}
          <MapPreview className="w-1/3" />
        </Row>
      </Container>
    </>
  );
};
