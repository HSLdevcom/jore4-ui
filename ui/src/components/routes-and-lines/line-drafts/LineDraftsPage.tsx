import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { RouteLine } from '../../../generated/graphql';
import { useUrlQuery } from '../../../hooks';
import { useGetLineDraftDetails } from '../../../hooks/line-drafts/useGetLineDraftDetails';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { CloseIconButton } from '../../../uiComponents';
import { RoutesTable } from '../main/RoutesTable';
import { LineDraftTableHeader } from './LineDraftsTableHeader';
import { LineDraftTableRow } from './LineDraftTableRow';

export const LineDraftsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { label } = useParams<{ label: string }>();
  const { returnTo } = useUrlQuery();
  const { lines } = useGetLineDraftDetails();

  const onClose = () => {
    // If there is no returnTo set, we return to 'routes and lines' page
    const pathname = returnTo
      ? routeDetails[Path.lineDetails].getLink(returnTo as string)
      : routeDetails[Path.routes].getLink();

    history.push({
      pathname,
    });
  };

  return (
    <Container>
      <Row>
        <h1 className="text-2xl font-bold">
          {`${t('lines.draftsTitle')} | ${t('lines.line', { label })}`}
        </h1>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={onClose}
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
          <p className="mx-auto flex text-2xl font-bold">
            {t('lines.noDrafts')}
          </p>
        </Row>
      )}
    </Container>
  );
};
