import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TerminalInfoSpotRow } from './terminal-info-spot-row';
import { TerminalInfoSpotsViewListHeader } from './TerminalInfoSpotsViewListHeader';
import { TerminalInfoSpotsViewListProps } from './types';
import { sortInfoSpots, useSorting } from './utils';

const testIds = {
  table: 'TerminalInfoSpotsViewList::table',
  tableContent: 'TerminalInfoSpotsViewList::tableContent',
};

export const TerminalInfoSpotsViewList: FC<TerminalInfoSpotsViewListProps> = ({
  infoSpots,
  terminal,
  latestAdded,
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
      <TerminalInfoSpotsViewListHeader
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        getSortIconTransform={getSortIconTransform}
      />

      <tbody
        className="text-hsl-datbodyk-80"
        data-testid={testIds.tableContent}
      >
        {sortedInfoSpots.map((infoSpot, index) => (
          <TerminalInfoSpotRow
            key={infoSpot.id}
            infoSpot={infoSpot}
            index={index}
            terminal={terminal}
            openByDefault={infoSpot.id === latestAdded}
          />
        ))}
      </tbody>
    </table>
  );
};
