import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
} from '../../generated/graphql';
import { useAlertsAndHighLights } from '../../hooks';
import { Column, Row, Visible } from '../../layoutComponents';
import { Path, routeDetails } from '../../router/routeDetails';
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../../time';
import { LocatorButton } from '../../uiComponents';
import { LineDetailsButton } from './LineDetailsButton';
import { LineTimetablesButton } from './LineTimetablesButton';

export enum RouteLineTableRowVariant {
  Timetables,
  RoutesAndLines,
}

interface Props {
  className?: string;
  lineId: UUID;
  hasTimetables?: boolean;
  onLocatorButtonClick?: () => void;
  locatorButtonTestId: string;
  rowItem: LineTableRowFragment | RouteTableRowFragment;
  rowVariant: RouteLineTableRowVariant;
  isSelected?: boolean;
  onSelectChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectionDisabled?: boolean;
}

const yBorderClassnames = 'border-y border-y-light-grey';

const getDisplayInformation = (
  routeLineTableRowVariant: RouteLineTableRowVariant,
  lineId: UUID,
  hasTimetables?: boolean,
) => {
  switch (routeLineTableRowVariant) {
    case RouteLineTableRowVariant.Timetables:
      return {
        rowIcon: (
          <i
            className={`icon-calendar text-2xl ${
              hasTimetables ? 'text-tweaked-brand' : 'text-zinc-400'
            }`}
          />
        ),
        alternativeRowActionButton: <LineDetailsButton lineId={lineId} />,
        linkTo: routeDetails[Path.lineTimetables].getLink(lineId),
        isDisabled: !hasTimetables,
      };
    case RouteLineTableRowVariant.RoutesAndLines:
    default:
      return {
        rowIcon: <i className="icon-bus-alt text-2xl text-tweaked-brand" />,
        alternativeRowActionButton: (
          <LineTimetablesButton disabled={!hasTimetables} lineId={lineId} />
        ),
        linkTo: routeDetails[Path.lineDetails].getLink(lineId),
        isDisabled: false,
      };
  }
};

/**
 * The visual component used for displaying RouteTableRow and LineTableRow
 */
export const RouteLineTableRow = ({
  className = '',
  lineId,
  hasTimetables,
  onLocatorButtonClick,
  onSelectChanged,
  locatorButtonTestId,
  rowItem,
  rowVariant,
  isSelected,
  selectionDisabled = false,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(rowItem));
  const alertIcon = alertStyle.icon || 'icon-_-placeholder';

  const displayInformation = getDisplayInformation(
    rowVariant,
    lineId,
    hasTimetables,
  );

  const disabledStyle = 'pointer-events-none text-zinc-400';

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
        <Link
          to={displayInformation.linkTo}
          className={displayInformation.isDisabled ? disabledStyle : ''}
        >
          <Row className="items-center">
            <Column className="w-1/2 font-bold">
              <Row>
                <h2>{rowItem.label}</h2>
                {displayInformation.rowIcon}
              </Row>
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
        className={`w-1/12 pl-6 text-right align-middle ${yBorderClassnames}`}
      >
        {displayInformation.alternativeRowActionButton}
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
