import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdPinDrop } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { RouteLine } from '../generated/graphql';
import { useShowRoutesOnModal } from '../hooks';
import { Column, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../time';
import { IconButton } from '../uiComponents';

interface Props {
  className?: string;
  line: RouteLine;
}

export const LineTableRow = ({ className, line }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRoutesOnModal } = useShowRoutesOnModal();

  const showLineRoutes = () => {
    const lineRouteIds = line.line_routes?.map((item) => item.route_id);
    showRoutesOnModal(lineRouteIds);
  };

  return (
    <tbody>
      <tr className={`border ${className}`}>
        <td className="border-l-8 border-hsl-dark-green py-4 pl-16 pr-4 font-bold">
          <Link to={routes[Path.lineDetails].getLink(line.line_id)}>
            <Row>
              <Column className="w-1/2">
                <p className="text-3xl">{line.label}</p>
                <p className="text-lg">{line.name_i18n}</p>
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
          <IconButton
            className="h-full w-full"
            onClick={showLineRoutes}
            icon={<MdPinDrop className="text-5xl text-tweaked-brand" />}
            testId="LineTableRow::showLineRoutes"
          />
        </td>
      </tr>
    </tbody>
  );
};
