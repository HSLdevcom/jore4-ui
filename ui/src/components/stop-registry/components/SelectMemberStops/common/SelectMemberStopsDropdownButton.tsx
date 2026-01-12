import { FC } from 'react';
import { JoreComboboxButton } from '../../../../../uiComponents';
import { SelectedStop } from './schema';

const testIds = {
  button: 'SelectMemberStopsDropdownButton',
};

type SelectMemberStopsDropdownButtonProps = {
  readonly selected: ReadonlyArray<SelectedStop>;
};

export const SelectMemberStopsDropdownButton: FC<
  SelectMemberStopsDropdownButtonProps
> = ({ selected }) => {
  const selectedText = selected.map((stop) => stop.publicCode).join(', ');

  return (
    <JoreComboboxButton className="w-full" testId={testIds.button}>
      <span
        className="mr-auto hidden min-w-0 flex-1 truncate ui-not-open:block"
        title={selectedText}
      >
        {selectedText}
      </span>
    </JoreComboboxButton>
  );
};
