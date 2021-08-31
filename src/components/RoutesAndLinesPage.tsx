import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const openMapRoute = routes[Path.mapgl];
  return (
    <Container>
      <Row>
        <h1 className="text-5xl font-bold">{t('routes.routes')}</h1>
        <SimpleButton className="ml-auto" href={openMapRoute.getLink()}>
          {t('map.open')}
        </SimpleButton>
      </Row>
    </Container>
  );
};
