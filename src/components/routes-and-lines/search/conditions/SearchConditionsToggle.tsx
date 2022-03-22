import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton, ValueFn } from '../../../../uiComponents';

type Props = {
  isToggled: boolean;
  onClick: ValueFn;
};

export const SearchConditionToggle = ({
  isToggled,
  onClick,
}: Props): JSX.Element => {
  return (
    <IconButton
      onClick={onClick}
      icon={
        isToggled ? (
          <FaChevronUp className="text-3xl text-tweaked-brand" />
        ) : (
          <FaChevronDown className="text-3xl text-tweaked-brand" />
        )
      }
      testId="SearchConditionToggle::toggle"
    />
  );
};
