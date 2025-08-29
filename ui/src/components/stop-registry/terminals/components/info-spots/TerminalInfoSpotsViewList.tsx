import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TerminalInfoSpotRow } from './TerminalInfoSpotRow';
import { SortField, TerminalInfoSpotsViewListProps } from './types';
import { CSS_CLASSES, sortInfoSpots, useSorting } from './utils';

const testIds = {
  table: 'TerminalInfoSpotsViewList::table',
  sortButton: (column: string) =>
    `TerminalInfoSpotsViewList::sortButton::${column}`,
};

const SortableHeader: FC<{
  field: SortField;
  children: React.ReactNode;
  className?: string;
  onSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => string;
  getSortIconTransform: (field: SortField) => string;
}> = ({
  field,
  children,
  className = `${CSS_CLASSES.tableCell} text-left`,
  onSort,
  getSortIcon,
  getSortIconTransform,
}) => (
  <th className={className}>
    <button
      type="button"
      onClick={() => onSort(field)}
      className="flex items-center gap-2 font-bold hover:text-brand focus:text-brand focus:outline-none"
      data-testid={testIds.sortButton(field)}
    >
      {children}
      <i
        className={`${getSortIcon(field)} ${getSortIconTransform(field)}`}
        role="presentation"
      />
    </button>
  </th>
);

export const TerminalInfoSpotsViewList: FC<TerminalInfoSpotsViewListProps> = ({
  infoSpots,
  location,
  terminal,
}) => {
  const { t } = useTranslation();
  const { sortConfig, handleSort, getSortIcon, getSortIconTransform } =
    useSorting();

  const sortedInfoSpots = useMemo(
    () => sortInfoSpots(infoSpots, sortConfig, t, terminal),
    [infoSpots, sortConfig, t, terminal],
  );

  return (
    <table
      className="w-full border-x border-x-light-grey"
      data-testid={testIds.table}
    >
      <thead className="bg-background-hsl-commuter-train-purple bg-opacity-25 font-bold">
        <tr>
          <SortableHeader
            field="label"
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getSortIconTransform={getSortIconTransform}
          >
            {t('terminalDetails.infoSpots.label')}
          </SortableHeader>
          <SortableHeader
            field="stop"
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getSortIconTransform={getSortIconTransform}
          >
            {t('terminalDetails.infoSpots.stop')}
          </SortableHeader>
          <SortableHeader
            field="shelter"
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getSortIconTransform={getSortIconTransform}
          >
            {t('terminalDetails.infoSpots.shelter')}
          </SortableHeader>
          <SortableHeader
            field="purpose"
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getSortIconTransform={getSortIconTransform}
          >
            {t('terminalDetails.infoSpots.purpose')}
          </SortableHeader>
          <SortableHeader
            field="size"
            className={`${CSS_CLASSES.tableCell} text-left`}
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getSortIconTransform={getSortIconTransform}
          >
            {t('terminalDetails.infoSpots.size')}
          </SortableHeader>
          <SortableHeader
            field="description"
            className={`${CSS_CLASSES.descriptionCell} text-left`}
            onSort={handleSort}
            getSortIcon={getSortIcon}
            getSortIconTransform={getSortIconTransform}
          >
            {t('terminalDetails.infoSpots.description')}
          </SortableHeader>
          <th className={CSS_CLASSES.actionCell}>
            <span className="sr-only">{t('common.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody className="text-hsl-datbodyk-80">
        {sortedInfoSpots.map((infoSpot, index) => (
          <TerminalInfoSpotRow
            key={infoSpot.id}
            infoSpot={infoSpot}
            location={location}
            index={index}
            terminal={terminal}
          />
        ))}
      </tbody>
    </table>
  );
};
