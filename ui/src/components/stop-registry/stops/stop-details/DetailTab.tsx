import { FC } from 'react';
import { SimpleSmallButton } from '../../../../uiComponents';

type DetailTabProps = {
  readonly id: string;
  readonly tabPanelId: string;
  readonly testId: string;
  readonly title: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

export const DetailTab: FC<DetailTabProps> = ({
  id,
  tabPanelId,
  testId,
  title,
  isActive,
  onClick,
  className = '',
}) => {
  return (
    <SimpleSmallButton
      id={id}
      testId={testId}
      inverted={!isActive}
      ariaSelected={isActive}
      onClick={onClick}
      label={title}
      className={`px-4 py-1 ${className}`}
      aria-controls={tabPanelId}
      role="tab"
    />
  );
};
