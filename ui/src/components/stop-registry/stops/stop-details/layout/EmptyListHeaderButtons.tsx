import noop from 'lodash/noop';
import { FC } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { SimpleButton } from '../../../../../uiComponents';

type EmptyListHeaderButtonsProps = {
  readonly addNewItemText: string;
  readonly onAddNewItem: () => void;
  readonly testIdPrefix?: string;
};

const testIds = {
  toggle: (prefix: string) => `${prefix}::toggle`,
  addNewItemButton: (prefix: string) => `${prefix}::addNewItemButton`,
};

export const EmptyListHeaderButtons: FC<EmptyListHeaderButtonsProps> = ({
  addNewItemText,
  onAddNewItem,
  testIdPrefix = '',
}) => {
  return (
    <div className="flex gap-2">
      <SimpleButton
        shape="slim"
        testId={testIds.addNewItemButton(testIdPrefix)}
        inverted
        onClick={onAddNewItem}
      >
        {addNewItemText}
      </SimpleButton>
      <SimpleButton
        shape="slim"
        onClick={noop}
        inverted
        disabled
        testId={testIds.toggle(testIdPrefix)}
      >
        <FaChevronDown className="text-white" aria-hidden />
      </SimpleButton>
    </div>
  );
};
