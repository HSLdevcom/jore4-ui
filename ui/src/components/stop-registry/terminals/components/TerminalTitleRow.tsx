import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LocatorButton } from '../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../utils';
import { PageTitle } from '../../../common';
import { ObservationDateControl } from '../../../common/ObservationDateControl';
import { useShowTerminalOnMap } from '../../utils/useShowTerminalOnMap';
import { TerminalComponentProps } from '../types';

const testIds = {
  privateCode: 'TerminalTitleRow::privateCode',
  name: 'TerminalTitleRow::name',
  locatorButton: 'TerminalTitleRow::locatorButton',
};

export const TerminalTitleRow: FC<TerminalComponentProps> = ({
  terminal,
  className = '',
}) => {
  const { t } = useTranslation();
  const showOnMap = useShowTerminalOnMap();
  const point = mapLngLatToPoint(terminal.geometry?.coordinates ?? []);

  const onClickTerminalMap = point
    ? () => showOnMap(terminal.id ?? undefined, point)
    : noop;

  return (
    <div className={twMerge('flex items-center', className)}>
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
        className="mr-2 mt-5"
      />

      <ObservationDateControl containerClassName="w-1/6" />
    </div>
  );
};
