import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { RouteLine } from '../../../generated/graphql';
import {
  useAppDispatch,
  useGetLineDetails,
  useMapUrlQuery,
} from '../../../hooks';
import { Column, Container, Row } from '../../../layoutComponents';
import {
  resetMapEditorStateAction,
  setIsModalMapOpenAction,
  setRouteMetadataAction,
} from '../../../redux';
import { DateLike, mapToShortDate } from '../../../time';
import { SimpleButton } from '../../../uiComponents';
import { PageHeader } from '../common/PageHeader';
import { ActionsRow } from './ActionsRow';
import { AdditionalInformation } from './AdditionalInformation';
import { MapPreview } from './MapPreview';
import { RouteStopsTable } from './RouteStopsTable';

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

interface LineTitleProps {
  className?: string;
  line: RouteLine;
  onCreateRoute: () => void;
}

const LineTitle: React.FC<LineTitleProps> = ({
  className,
  line,
  onCreateRoute,
}) => {
  const { t } = useTranslation();

  const onToggleRoute = () => {
    // eslint-disable-next-line no-console
    console.log('TODO');
  };

  return (
    <Row className={`items-center ${className}`}>
      <span className="mr-4 text-4xl font-bold" data-testid="line-page-heading">
        {t('lines.line', { label: line.label })}
      </span>
      <span>
        {line.line_routes?.length > 0 &&
          line.line_routes.map((item) => (
            <SimpleButton
              key={item.route_id}
              className="mr-2 w-20 !rounded bg-tweaked-brand !px-0 !py-0 !text-sm !font-light text-white"
              onClick={onToggleRoute}
            >
              {item.label}
            </SimpleButton>
          ))}
      </span>
      <button type="button" onClick={onCreateRoute}>
        <AiFillPlusCircle className="text-3xl text-brand" />
      </button>
    </Row>
  );
};

export const LineDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapUrlQuery();

  const { line } = useGetLineDetails();

  const buildValidityPeriod = (
    validityStart?: DateLike | null,
    validityEnd?: DateLike | null,
  ) =>
    `${mapToShortDate(validityStart) || ''} - ${
      mapToShortDate(validityEnd) || ''
    }`;

  const onCreateRoute = () => {
    dispatch(resetMapEditorStateAction());
    dispatch(setRouteMetadataAction({ on_line_id: id }));
    dispatch(setIsModalMapOpenAction(true));
    addMapOpenQueryParameter();
  };

  return (
    <div>
      <PageHeader>
        <Row>
          <Column>
            <i className="icon-bus-alt text-5xl text-tweaked-brand" />
          </Column>
          <Column>
            {line && <LineTitle line={line} onCreateRoute={onCreateRoute} />}
            <span data-testid="line-header-name">{line?.name_i18n}</span>
            <Row>
              <i className="icon-time2 text-xl text-city-bicycle-yellow" />
              <span data-testid="line-header-validity-period">
                {buildValidityPeriod(line?.validity_start, line?.validity_end)}
              </span>
            </Row>
          </Column>
        </Row>
      </PageHeader>
      <ActionsRow className="!pt-4 !pb-0" />
      {line && (
        <Container className="pt-10">
          <Column>
            <Row>
              <AdditionalInformation className="w-2/3" line={line} />
              <MapPreview className="w-1/3" />
            </Row>
            <Row>
              <Column className="w-full">
                <h1 className="mt-8 text-3xl font-semibold">
                  {t('lines.routes')}
                </h1>
                {line.line_routes?.length > 0 ? (
                  <RouteStopsTable routes={line.line_routes} />
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
