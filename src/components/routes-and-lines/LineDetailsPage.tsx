import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MapEditorContext } from '../../context/MapEditorContext';
import { ModalMapContext } from '../../context/ModalMapContext';
import { useGetLineDetailsByIdQuery } from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql/route';
import { Column, Container, Row } from '../../layoutComponents';
import { mapToShortDate } from '../../time';
import { SimpleButton } from '../../uiComponents';
import { mapToVariables } from '../../utils';
import { AdditionalInformation } from './AdditionalInformation';
import { MapPreview } from './MapPreview';
import { PageHeader } from './PageHeader';
import { RouteStopsTable } from './RouteStopsTable'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  onCreateRoute: () => void;
}

const CreateRouteBox: React.FC<Props> = ({ className, onCreateRoute }) => {
  const { t } = useTranslation();

  return (
    <Column
      className={`items-center border border-light-grey bg-background p-8 ${className}`}
    >
      <SimpleButton
        id="create-route-button"
        className="mb-4"
        onClick={onCreateRoute}
      >
        {t('lines.createNewRoute')}
      </SimpleButton>
      <span>{t('lines.createNewRouteInstructions')}</span>
    </Column>
  );
};

export const LineDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);

  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);

  const buildValidityPeriod = (validityStart?: string, validityEnd?: string) =>
    `${mapToShortDate(validityStart)} - ${mapToShortDate(validityEnd)}`;

  const onCreateRoute = () => {
    mapEditorDispatch({ type: 'reset' });
    mapEditorDispatch({
      type: 'setState',
      payload: {
        routeDetails: { on_line_id: id, description_i18n: 'Route X' },
      },
    });
    modalMapDispatch({ type: 'open' });
  };

  return (
    <div>
      <PageHeader>
        <Row>
          <Column>
            <i className="icon-bus-alt text-5xl text-tweaked-brand" />
          </Column>
          <Column>
            <h1 className="text-5xl font-bold">
              {t('lines.line')} {line?.label}
            </h1>
            {line?.name_i18n}
            <Row>
              <i className="icon-time2 text-xl text-city-bicycle-yellow" />
              {buildValidityPeriod(line?.validity_start, line?.validity_end)}
            </Row>
          </Column>
        </Row>
      </PageHeader>
      {line && (
        <Container>
          <Column>
            <Row>
              <AdditionalInformation className="w-2/3" line={line} />
              <MapPreview className="w-1/3" />
            </Row>
            <Row>
              <Column className="w-full">
                <h1 className="text-3xl">{t('lines.routes')}</h1>
                {line.line_routes?.length > 0 ? (
                  line.line_routes.map((item) => {
                    return <RouteStopsTable key={item.route_id} route={item} />;
                  })
                ) : (
                  <CreateRouteBox onCreateRoute={onCreateRoute} />
                )}
              </Column>
            </Row>
          </Column>
        </Container>
      )}
    </div>
  );
};
