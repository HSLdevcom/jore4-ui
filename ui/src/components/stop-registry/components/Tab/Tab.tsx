import { FC } from 'react';
import { SimpleButton } from '../../../../uiComponents';

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
  className,
}) => {
  return (
    <SimpleButton
      id={id}
      testId={testId}
      inverted={!isActive}
      ariaSelected={isActive}
      onClick={onClick}
      className={className}
      shape="slim"
      aria-controls={tabPanelId}
      role="tab"
    >
      {title}
    </SimpleButton>
  );
};
