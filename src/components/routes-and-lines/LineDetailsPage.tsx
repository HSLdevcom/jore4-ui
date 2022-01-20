import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetLineDetailsByIdQuery } from '../../generated/graphql';
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

  const buildValidityPeriod = (validityStart?: string, validityEnd?: string) =>
    `${mapToShortDate(validityStart)} - ${mapToShortDate(validityEnd)}`;

  return (
    <div>
      <PageHeader>
        <Row>
          <Column>
            <i className="icon-bus-alt text-tweaked-brand text-5xl" />
          </Column>
          <Column>
            <h1 className="text-5xl font-bold">
              {t('lines.line')} {line?.label}
            </h1>
            {line?.name_i18n}
            <Row>
              <i className="icon-time2 text-city-bicycle-yellow text-xl" />
              {buildValidityPeriod(line?.validity_start, line?.validity_end)}
            </Row>
          </Column>
        </Row>
      </PageHeader>
      <Container>
        <Row>
          {line && <AdditionalInformation className="w-2/3" line={line} />}
          <MapPreview className="w-1/3" />
        </Row>
      </Container>
    </div>
  );
};
