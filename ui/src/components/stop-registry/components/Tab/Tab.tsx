import { FC } from 'react';
import { SlimSimpleButton } from '../../stops/stop-details/layout';

type TabProps = {
  readonly id: string;
  readonly tabPanelId: string;
  readonly testId: string;
  readonly title: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

export const Tab: FC<TabProps> = ({
  id,
  tabPanelId,
  testId,
  title,
  isActive,
  onClick,
  className = '',
}) => {
  return (
    <SlimSimpleButton
      id={id}
      testId={testId}
      inverted={!isActive}
      ariaSelected={isActive}
      onClick={onClick}
      className={`px-4 py-1 ${className}`}
      aria-controls={tabPanelId}
      role="tab"
    >
      {title}
    </SlimSimpleButton>
  );
};
