import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { LocatorButton } from '../../../../uiComponents';
import { useShowTerminalOnMap } from '../../utils/useShowTerminalOnMap';
import { ActionMenu } from '../components/StopPlaceSharedComponents/ActionMenu/ActionMenu';
import { OpenDetails } from '../components/StopPlaceSharedComponents/ActionMenu/OpenDetailsPage';
import { ShowOnMap } from '../components/StopPlaceSharedComponents/ActionMenu/ShowOnMap';
import { FindStopPlaceInfo } from '../components/StopPlaceSharedComponents/useFindStopPlaces';
import { centroidToPoint } from '../utils/centroidToPoint';

const testIds = {
  terminalLabel: 'TerminalSearch::label',
  terminalLink: 'TerminalSearch::link',
  locatorButton: 'TerminalSearch::locatorButton',
  showOnMap: 'TerminalSearch::showOnMap',
  showTerminalDetails: 'TerminalSearch::showTerminalDetails',
};

type TerminalHeaderProps = {
  readonly className?: string;
  readonly stopPlace: FindStopPlaceInfo;
  readonly isRounded: boolean;
};

export const TerminalHeader: FC<TerminalHeaderProps> = ({
  className,
  stopPlace: terminal,
  isRounded,
}) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const showOnMap = useShowTerminalOnMap();
  const point = centroidToPoint(terminal.centroid);

  const onClickMap = point
    ? () => showOnMap(terminal.netex_id ?? undefined, point)
    : noop;

  return (
    <div
      className={twMerge(
        'flex items-center gap-4 rounded-t-xl border-x border-t border-x-border-hsl-commuter-train-purple border-t-border-hsl-commuter-train-purple bg-background-hsl-commuter-train-purple p-4',
        isRounded
          ? 'rounded-b-xl border-b border-b-border-hsl-commuter-train-purple'
          : '',
        className,
      )}
    >
      <Link
        to={routeDetails[Path.terminalDetails].getLink(terminal.private_code, {
          observationDate,
        })}
        data-testid={testIds.terminalLink}
        title={t('accessibility:terminals.showTerminalDetails', {
          terminalLabel: terminal.name_value,
        })}
      >
        <h3 data-testid={testIds.terminalLabel}>
          {t('stopRegistrySearch.terminalLabel', {
            privateCode: terminal.private_code,
            name: terminal.name_value,
          })}
        </h3>
      </Link>

      <div className="flex-grow" />

      <LocatorButton
        onClick={onClickMap}
        tooltipText={t('stopRegistrySearch.terminalRowActions.showOnMap')}
        testId={testIds.locatorButton}
      />

      <ActionMenu>
        <OpenDetails
          key="openDetails"
          className={className}
          privateCode={terminal.private_code}
          testId={testIds.showTerminalDetails}
          text={t('stopRegistrySearch.terminalRowActions.openDetails')}
          details={Path.terminalDetails}
        />
        <ShowOnMap
          key="showOnMap"
          className={className}
          onClick={onClickMap}
          testId={testIds.showOnMap}
          text={t('stopRegistrySearch.terminalRowActions.showOnMap')}
        />
      </ActionMenu>
    </div>
  );
};
