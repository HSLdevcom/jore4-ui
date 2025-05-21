import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { PageTitle } from '../../../common';
import { ObservationDateControl } from '../../../common/ObservationDateControl';
import { TerminalComponentProps } from '../types';

const testIds = {
  privateCode: 'TerminalTitleRow::privateCode',
  name: 'TerminalTitleRow::name',
};

export const TerminalTitleRow: FC<TerminalComponentProps> = ({
  terminal,
  className = '',
}) => {
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
      <ObservationDateControl containerClassName="w-1/6" />
    </div>
  );
};
