import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';
import { ModalMap } from './map/ModalMap';
import { RoutesTable } from './RoutesTable'; // eslint-disable-line import/no-cycle

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const openMapRoute = routes[Path.map];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
      <Row>
        <h1 className="text-5xl font-bold">{t('routes.routes')}</h1>
        <SimpleButton className="ml-auto" href={openMapRoute.getLink()}>
          {t('map.open')}
        </SimpleButton>
      </Row>
      <Row className="mt-2">
        <SimpleButton className="ml-auto" onClick={() => setIsOpen(true)}>
          Piirrä reitti
        </SimpleButton>
      </Row>
      <h2 className="text-bold mb-14 mt-12 text-4xl">Esimerkkireitit</h2>
      <RoutesTable />
      <ModalMap isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Container>
  );
};
