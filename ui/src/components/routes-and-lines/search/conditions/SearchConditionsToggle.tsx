import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from '../../../../uiComponents';

type Props = {
  isToggled: boolean;
  onClick: () => void;
};

export const SearchConditionToggle = ({
  isToggled,
  onClick,
}: Props): JSX.Element => {
  const iconClassName = 'text-3xl text-tweaked-brand';
  return (
    <IconButton
      onClick={onClick}
      icon={
        isToggled ? (
          <FaChevronUp className={iconClassName} />
        ) : (
          <FaChevronDown className={iconClassName} />
        )
      }
      testId="SearchConditionToggle::toggle"
    />
  );
};
