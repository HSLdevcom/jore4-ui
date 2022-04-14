import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import {
  RouteLine,
  useGetDraftLinesByLabelQuery,
} from '../../../generated/graphql';
import { mapDraftLinesByLabelResult } from '../../../graphql';
import { Container, Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';
import { mapToVariables } from '../../../utils';
import { RoutesTable } from '../main/RoutesTable';
import { LineDraftTableHeader } from './LineDraftsTableHeader';
import { LineDraftTableRow } from './LineDraftTableRow';

export const LineDraftsPage = () => {
  const { t } = useTranslation();
  const { label } = useParams<{ label: string }>();
  const history = useHistory();

  const lineDetailsResult = useGetDraftLinesByLabelQuery(
    mapToVariables({ label }),
  );

  const lines = mapDraftLinesByLabelResult(lineDetailsResult);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <Container>
      <Row>
        <h1 className="text-2xl font-bold">
          {`${t('lines.draftsTitle')} | ${t('lines.line')} ${label}`}
        </h1>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>

      {lines?.length ? (
        <RoutesTable>
          <LineDraftTableHeader />
          {lines?.map((item: RouteLine) => (
            <LineDraftTableRow key={item.line_id} line={item} />
          ))}
        </RoutesTable>
      ) : (
        <Row className="py-20">
          <p className="mx-auto flex text-2xl font-bold">{`${t(
            'lines.noDrafts',
          )}`}</p>
        </Row>
      )}
    </Container>
  );
};
