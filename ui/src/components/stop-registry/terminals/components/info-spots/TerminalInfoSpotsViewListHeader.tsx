import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SortField } from './types';
import { CSS_CLASSES } from './utils';

const testIds = {
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
      className="flex items-center gap-2 font-bold hover:text-brand focus:text-brand focus:outline-hidden"
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

type TerminalInfoSpotsViewListHeaderProps = {
  handleSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => string;
  getSortIconTransform: (field: SortField) => string;
};

export const TerminalInfoSpotsViewListHeader: FC<
  TerminalInfoSpotsViewListHeaderProps
> = ({ handleSort, getSortIcon, getSortIconTransform }) => {
  const { t } = useTranslation();

  return (
    <thead className="bg-background-hsl-commuter-train-purple/25 font-bold">
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
          <span className="sr-only">
            {t('accessibility:terminals.openInfoSpots')}
          </span>
        </th>
      </tr>
    </thead>
  );
};
