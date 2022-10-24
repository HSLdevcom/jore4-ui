import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
} from '../../../generated/graphql';
import { useAlertsAndHighLights } from '../../../hooks';
import { Column, Row, Visible } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../../../time';
import { LocatorButton } from '../../../uiComponents';

interface Props {
  className?: string;
  onLocatorButtonClick?: () => void;
  locatorButtonTestId: string;
  lineId: UUID;
  rowItem: LineTableRowFragment | RouteTableRowFragment;
  isSelected?: boolean;
  onSelectChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectionDisabled?: boolean;
}

const yBorderClassnames = 'border-y border-y-light-grey';

export const RouteLineTableRow = ({
  className = '',
  onLocatorButtonClick,
  onSelectChanged,
  locatorButtonTestId,
  lineId,
  rowItem,
  isSelected,
  selectionDisabled = false,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(rowItem));
  const alertIcon = alertStyle.icon || 'icon-_-placeholder';

  return (
    <tr className={className}>
      <Visible visible={!!onSelectChanged}>
        {/*
          Hard coded width, so this column does not take too much space and
          checkbox is always aligned with "select all" checkbox above
         */}
        <td className="w-14 pr-6">
          <input
            type="checkbox"
            className="h-7 w-7"
            checked={isSelected}
            onChange={onSelectChanged}
            disabled={selectionDisabled}
          />
        </td>
      </Visible>
      <td className={`${alertStyle.listItemBorder} ${yBorderClassnames} p-4`}>
        <i className={`${alertIcon} my-auto flex text-3xl`} />
      </td>
      <td className={`w-full py-4 ${yBorderClassnames}`}>
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
      <td
        className={`w-1/12 border-r p-6 text-right align-middle ${yBorderClassnames}`}
      >
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
