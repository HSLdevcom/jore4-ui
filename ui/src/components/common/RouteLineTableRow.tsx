import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
  ReusableComponentsVehicleModeEnum as VehicleMode,
} from '../../generated/graphql';
import { isRoute } from '../../graphql';
import { useAlertsAndHighLights } from '../../hooks';
import { Column, Row, Visible } from '../../layoutComponents';
import { Path, routeDetails } from '../../router/routeDetails';
import { MAX_DATE, MIN_DATE, mapToShortDate } from '../../time';
import { LocatorButton } from '../../uiComponents';
import { TimetableIcon } from '../../uiComponents/TimetableIcon';
import { VehicleIcon } from '../../uiComponents/VehicleIcon';
import { AlertPopover } from './AlertPopover';
import { LineDetailsButton } from './LineDetailsButton';
import { LineTimetablesButton } from './LineTimetablesButton';
import { RouteLabel } from './RouteLabel';

const testIds = {
  row: (testId: string) => `RouteLineTableRow::row::${testId}`,
  checkbox: (testId: string) => `RouteLineTableRow::checkbox::${testId}`,
};

export enum RouteLineTableRowVariant {
  Timetables,
  RoutesAndLines,
}

type RowItem = LineTableRowFragment | RouteTableRowFragment;

type RouteLineTableRowProps = {
  readonly className?: string;
  readonly lineId: UUID;
  readonly hasTimetables?: boolean;
  readonly onLocatorButtonClick?: () => void;
  readonly locatorButtonTestId: string;
  readonly rowItem: RowItem;
  readonly rowVariant: RouteLineTableRowVariant;
  readonly isSelected?: boolean;
  readonly onSelectChanged?: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  readonly selectionDisabled?: boolean;
  readonly testId: string;
};

const yBorderClassNames = 'border-y border-y-light-grey';
const rBorderClassNames = 'border-r border-r-light-grey';

const getDisplayInformation = (
  routeLineTableRowVariant: RouteLineTableRowVariant,
  lineId: UUID,
  rowItem: RowItem,
  hasTimetables?: boolean,
) => {
  const routeLabel = isRoute(rowItem) ? rowItem.label : undefined;

  switch (routeLineTableRowVariant) {
    case RouteLineTableRowVariant.Timetables:
      return {
        rowIcon: (
          <TimetableIcon className="text-2xl" hasTimetables={hasTimetables} />
        ),
        alternativeRowActionButton: (
          <LineDetailsButton
            lineId={lineId}
            routeLabel={routeLabel}
            label={rowItem.label}
          />
        ),
        linkTo: routeDetails[Path.lineTimetables].getLink(lineId, {
          routeLabels: routeLabel,
        }),
        isDisabled: !hasTimetables,
      };
    case RouteLineTableRowVariant.RoutesAndLines:
    default:
      return {
        rowIcon: (
          <VehicleIcon
            className="text-2xl text-tweaked-brand"
            vehicleMode={
              VehicleMode.Bus /* TODO: This hardcode needs proper logic when other vehicles are implemented */
            }
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
        linkTo: routeDetails[Path.lineDetails].getLink(lineId, {
          routeLabels: routeLabel,
        }),
        isDisabled: false,
      };
  }
};

/**
 * The visual component used for displaying RouteTableRow and LineTableRow
 */
export const RouteLineTableRow: FC<RouteLineTableRowProps> = ({
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
}) => {
  const { t } = useTranslation();

  const { getAlertStatus, getAlertStyle } = useAlertsAndHighLights();
  const alertStatus = getAlertStatus(rowItem);
  const alertStyle = getAlertStyle(alertStatus.alertLevel);

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
  function getMapButtonTooltip(item: RowItem): string {
    const { label } = item;
    // eslint-disable-next-line no-underscore-dangle
    switch (item.__typename) {
      case 'route_line': {
        return t('accessibility:lines.showOnMap', { label });
      }
      case 'route_route': {
        return t('accessibility:routes.showOnMap', { label });
      }
      default: {
        return t('accessibility:common.showOnMap', { label });
      }
    }
  }

  return (
    <tr
      className={`${rBorderClassNames} ${className}`}
      data-testid={testIds.row(testId)}
    >
      <Visible visible={!!onSelectChanged}>
        {/*
          Hard coded width, so this column does not take too much space and
          checkbox is always aligned with "select all" checkbox above
         */}
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
      <td className={`${alertStyle.listItemBorder} ${yBorderClassNames} p-4`}>
        <AlertPopover
          title={t(alertStatus.title)}
          description={t(alertStatus.description)}
          alertIcon={alertStyle.icon}
        />
      </td>
      <td className={`w-full py-4 ${yBorderClassNames}`}>
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
                  startDate: mapToShortDate(rowItem.validity_start ?? MIN_DATE),
                  endDate: mapToShortDate(rowItem.validity_end ?? MAX_DATE),
                })}
              </p>
              <p>!Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija</p>
            </Column>
          </Row>
        </Link>
      </td>
      <td
        className={`w-1/12 pl-6 text-right align-middle ${yBorderClassNames}`}
      >
        {displayInformation.alternativeRowActionButton}
      </td>
      <td className={`w-1/12 p-6 text-right align-middle ${yBorderClassNames}`}>
        <LocatorButton
          // Button is disabled if function is not defined
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onClick={onLocatorButtonClick!}
          disabled={!onLocatorButtonClick}
          testId={locatorButtonTestId}
          tooltipText={getMapButtonTooltip(rowItem)}
        />
      </td>
    </tr>
  );
};
