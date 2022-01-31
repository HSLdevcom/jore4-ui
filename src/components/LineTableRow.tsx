import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdPinDrop } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import { RouteLine } from '../generated/graphql';
import { Column, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../time';

interface Props {
  className?: string;
  line: RouteLine;
}

export const LineTableRow = ({ className, line }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);

  // TODO currently can only show a single route
  const onShowLineRoutes = () => {
    mapEditorDispatch({ type: 'reset' });
    mapEditorDispatch({
      type: 'setState',
      payload: {
        displayedRouteId: line.line_routes?.[0]?.route_id,
      },
    });
    modalMapDispatch({ type: 'open' });
  };

  return (
    <tbody>
      <tr className={`border ${className}`}>
        <td className="border-l-8 border-hsl-dark-green py-4 pl-16 pr-4 font-bold">
          <Link to={routes[Path.lineDetails].getLink(line.line_id)}>
            <Row>
              <Column className="w-1/2">
                <p className="text-3xl">{line.label}</p>
                <p className="text-lg">{line.description_i18n}</p>
              </Column>
              <Column className="w-1/2 text-right">
                <p className="text-lg font-bold">
                  {t('validity.validDuring', {
                    startDate: mapToShortDate(line.validity_start || MIN_DATE),
                    endDate: mapToShortDate(line.validity_end || MAX_DATE),
                  })}
                </p>
                <p className="text-lg">
                  !Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija
                </p>
              </Column>
            </Row>
          </Link>
        </td>
        <td className="w-20 border">
          <button
            type="button"
            className="h-full w-full text-center"
            onClick={onShowLineRoutes}
            data-testid="RoutesTableRow::showRoute"
          >
            <MdPinDrop className="inline text-center text-5xl text-tweaked-brand" />
          </button>
        </td>
      </tr>
    </tbody>
  );
};
