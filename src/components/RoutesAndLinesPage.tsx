import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useListChangingRoutesQuery } from '../generated/graphql';
import { mapListChangingRoutesResult } from '../graphql/route';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';
import { ModalMap } from './map/ModalMap';
import { RoutesTable } from './RoutesTable'; // eslint-disable-line import/no-cycle

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const openMapRoute = routes[Path.map];
  const createLineReactRoute = routes[Path.createLine];
  const [isOpen, setIsOpen] = useState(false);
  const changingRoutesResult = useListChangingRoutesQuery();
  const changingRoutes = mapListChangingRoutesResult(changingRoutesResult);

  return (
    <Container>
      <Row>
        <h1 className="text-5xl font-bold">{t('routes.routes')}</h1>
        <SimpleButton className="ml-auto" href={openMapRoute.getLink()}>
          {t('map.open')}
        </SimpleButton>
        <SimpleButton
          id="create-line-button"
          className="ml-3"
          href={createLineReactRoute.getLink()}
        >
          {t('lines.createNew')}
        </SimpleButton>
      </Row>
      <Row className="mt-2">
        <SimpleButton className="ml-auto" onClick={() => setIsOpen(true)}>
          Piirrä reitti
        </SimpleButton>
      </Row>
      <h2 className="text-bold mb-14 mt-12 text-4xl">
        {t('routes.changingRoutes')}
      </h2>
      {changingRoutes && <RoutesTable routes={changingRoutes} />}
      <ModalMap isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Container>
  );
};
