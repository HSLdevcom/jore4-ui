import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton, ValueFn } from '../../../../uiComponents';

export const SearchConditionToggle = ({
  isToggled,
  onClick,
}: {
  isToggled: boolean;
  onClick: ValueFn;
}): JSX.Element => {
  return (
    <>
      {isToggled ? (
        <IconButton
          onClick={onClick}
          icon={<FaChevronUp className="text-3xl text-tweaked-brand" />}
          testId="RoutesTableRow::showRoute"
        />
      ) : (
        <IconButton
          onClick={onClick}
          icon={<FaChevronDown className="text-3xl text-tweaked-brand" />}
          testId="RoutesTableRow::showRoute"
        />
      )}
    </>
  );
};
