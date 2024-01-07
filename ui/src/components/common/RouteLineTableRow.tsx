import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
  ReusableComponentsVehicleModeEnum as Vehicle,
} from '../../generated/graphql';
import { isRoute } from '../../graphql';
import { useAlertsAndHighLights } from '../../hooks';
import { Column, Row, Visible } from '../../layoutComponents';
import { Path, routeDetails } from '../../router/routeDetails';
import { MAX_DATE, MIN_DATE, mapToShortDate } from '../../time';
import { LocatorButton } from '../../uiComponents';
import { VehicleIcon } from '../../uiComponents/VehicleIcon';
import { LineDetailsButton } from './LineDetailsButton';
import { LineTimetablesButton } from './LineTimetablesButton';
import { RouteLabel } from './RouteLabel';

const testIds = {
  checkbox: (testId: string) => `RouteLineTableRow::checkbox::${testId}`,
};

export enum RouteLineTableRowVariant {
  Timetables,
  RoutesAndLines,
}

type RowItem = LineTableRowFragment | RouteTableRowFragment;

interface Props {
  className?: string;
  lineId: UUID;
  hasTimetables?: boolean;
  onLocatorButtonClick?: () => void;
  locatorButtonTestId: string;
  rowItem: RowItem;
  rowVariant: RouteLineTableRowVariant;
  isSelected?: boolean;
  onSelectChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectionDisabled?: boolean;
  testId: string;
}

const yBorderClassnames = 'border-y border-y-light-grey';

const getDisplayInformation = (
  routeLineTableRowVariant: RouteLineTableRowVariant,
  lineId: UUID,
  rowItem: RowItem,
  hasTimetables?: boolean,
) => {
  const routeLabel = isRoute(rowItem) ? rowItem.label : undefined;

  const vehicle = Vehicle.Bus; // TODO: New Ticket, this hardcode needs proper logic when other vehicles are implemented

  switch (routeLineTableRowVariant) {
    case RouteLineTableRowVariant.Timetables:
      return {
        rowIcon: (
          <i
            className={`icon-calendar text-2xl ${
              hasTimetables ? 'text-tweaked-brand' : 'text-zinc-400'
            }`}
            title="Timetable" // TODO: Not in a hook, so can't translate this. Refactor `VehicleIcon` or row completely?
            role="img"
          />
        ),
        alternativeRowActionButton: (
          <LineDetailsButton
            lineId={lineId}
            routeLabel={routeLabel}
            label={rowItem.label}
          />
        ),
        linkTo: routeDetails[Path.lineTimetables].getLink(lineId, routeLabel),
        isDisabled: !hasTimetables,
      };
    case RouteLineTableRowVariant.RoutesAndLines:
    default:
      return {
        rowIcon: (
          <VehicleIcon
            className="text-2xl text-tweaked-brand"
            vehicleType={vehicle}
            rowItem={rowItem}
          />
        ),
        alternativeRowActionButton: (
          <LineTimetablesButton
            disabled={!hasTimetables}
            lineId={lineId}
            routeLabel={routeLabel}
            label={rowItem.label}
          />
        ),
        linkTo: routeDetails[Path.lineDetails].getLink(lineId, routeLabel),
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
  testId,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(rowItem));
  const alertIcon = alertStyle.icon || 'icon-_-placeholder';

  const displayInformation = getDisplayInformation(
    rowVariant,
    lineId,
    rowItem,
    hasTimetables,
  );

  const disabledStyle = 'pointer-events-none text-zinc-400';

  /**
   * Determine the proper title text for the map button.
   * The title is mainly relevant for screen readers, but it also helps mouse users with added details.
   * TODO: This could be done better if the tables were refactored, especially if the "generic" line/route structure is removed at the same time.
   * @param RowItem
   * @returns An accessible translated text for this section's buttons.
   */
  function showOnMapAllyTitle(item: RowItem): string {
    const { label } = item;
    // eslint-disable-next-line no-underscore-dangle
    switch (item.__typename) {
      case 'route_line': {
        return t('accessibility:button.line.showOnMap', { label });
      }
      case 'route_route': {
        return t('accessibility:button.route.showOnMap', { label });
      }
      default: {
        return t('accessibility:button.showOnMap', { label });
      }
    }
  }

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
            data-testid={testIds.checkbox(testId)}
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
              <Row className="items-center">
                <h2>
                  {isRoute(rowItem) ? (
                    <RouteLabel
                      label={rowItem.label}
                      variant={rowItem.variant}
                    />
                  ) : (
                    rowItem.label
                  )}
                </h2>
                {displayInformation.rowIcon}
                {rowVariant === RouteLineTableRowVariant.Timetables &&
                  !hasTimetables &&
                  t('timetables.noTimetables')}
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
          title={showOnMapAllyTitle(rowItem)}
        />
      </td>
    </tr>
  );
};
