import noop from 'lodash/noop';
import { FC } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { SlimSimpleButton } from './SlimSimpleButton';

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
      <SlimSimpleButton
        testId={testIds.addNewItemButton(testIdPrefix)}
        inverted
        onClick={onAddNewItem}
      >
        {addNewItemText}
      </SlimSimpleButton>
      <SlimSimpleButton
        onClick={noop}
        inverted
        disabled
        testId={testIds.toggle(testIdPrefix)}
      >
        <FaChevronDown className="text-white" aria-hidden />
      </SlimSimpleButton>
    </div>
  );
};
