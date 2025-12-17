import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LocatorButton } from '../../../../uiComponents';
import { getGeometryPoint } from '../../../../utils';
import { PageTitle } from '../../../common';
import { ObservationDateControl } from '../../../common/ObservationDateControl';
import { useShowTerminalOnMap } from '../../utils/useShowTerminalOnMap';
import { TabSelector, TabType } from '../TabSelector';
import { TerminalComponentProps } from '../types';

const testIds = {
  privateCode: 'TerminalTitleRow::privateCode',
  name: 'TerminalTitleRow::name',
  locatorButton: 'TerminalTitleRow::locatorButton',
};

type TerminalTitleRowProps = TerminalComponentProps & {
  readonly activeTab: TabType;
  readonly selectTab: (tab: TabType) => void;
  readonly stopsCount?: number;
};

export const TerminalTitleRow: FC<TerminalTitleRowProps> = ({
  terminal,
  className,
  activeTab,
  selectTab,
  stopsCount,
}) => {
  const { t } = useTranslation();
  const showOnMap = useShowTerminalOnMap();
  const point = getGeometryPoint(terminal.geometry);

  const onClickTerminalMap = point
    ? () => showOnMap(terminal.id ?? undefined, point)
    : noop;

  return (
    <div className={twMerge('space-y-2', className)}>
      <div className="flex items-center">
        <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
        <PageTitle.H1
          className="mr-2"
          testId={testIds.privateCode}
          titleText={terminal.privateCode?.value ?? ''}
        >
          {terminal.privateCode?.value ?? ''}
        </PageTitle.H1>

        <div className="text-xl" data-testid={testIds.name}>
          {terminal.name ?? ''}
        </div>

        <div className="flex-grow" />
        <LocatorButton
          onClick={onClickTerminalMap}
          tooltipText={t('stopRegistrySearch.terminalRowActions.showOnMap')}
          testId={testIds.locatorButton}
        />
      </div>

      <div className="flex items-center justify-between">
        <TabSelector
          activeTab={activeTab}
          selectTab={selectTab}
          stopsCount={stopsCount}
        />
        <ObservationDateControl />
      </div>
    </div>
  );
};
