import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  LineTableRowFragment,
  RouteAllFieldsFragment,
} from '../../../generated/graphql';
import { useAlertsAndHighLights } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../../../time';
import { LocatorButton } from '../../../uiComponents';

interface Props {
  className?: string;
  onLocatorButtonClick?: () => void;
  locatorButtonTestId: string;
  lineId: UUID;
  rowItem: RouteAllFieldsFragment | LineTableRowFragment;
}

export const RouteLineTableRow = ({
  className = '',
  onLocatorButtonClick,
  locatorButtonTestId,
  lineId,
  rowItem,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(rowItem));

  return (
    <tr className={`border border-light-grey ${className}`}>
      <td className={`${alertStyle.listItemBorder || ''} w-20 p-4 align-top`}>
        {alertStyle.icon && <i className={`${alertStyle.icon} text-3xl`} />}
      </td>
      <td className="py-4">
        <Link to={routeDetails[Path.lineDetails].getLink(lineId)}>
          <Row className="items-center">
            <Column className="w-1/2 font-bold">
              <h2>{rowItem.label}</h2>
              <p>{rowItem.name_i18n.fi_FI}</p>
            </Column>
            <Column className="w-1/2 text-right">
              <p className="font-bold">
                {t('validity.validDuring', {
                  startDate: mapToShortDate(rowItem.validity_start || MIN_DATE),
                  endDate: mapToShortDate(rowItem.validity_end || MAX_DATE),
                })}
              </p>
              <p>!Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija</p>
            </Column>
          </Row>
        </Link>
      </td>
      <td className="w-20 p-6 align-middle">
        <LocatorButton
          // Button is disabled if function is not defined
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onClick={onLocatorButtonClick!}
          disabled={!onLocatorButtonClick}
          testId={locatorButtonTestId}
        />
      </td>
    </tr>
  );
};
