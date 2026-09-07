import { FC } from 'react';
import { SimpleButton, SimpleButtonShape } from '../../common/Buttons';

type DetailTabProps = {
  readonly id: string;
  readonly tabPanelId: string;
  readonly testId: string;
  readonly title: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
  readonly className?: string;
  readonly shape?: SimpleButtonShape;
};

export const DetailTab: FC<DetailTabProps> = ({
  id,
  tabPanelId,
  testId,
  title,
  isActive,
  onClick,
  className,
  shape = 'square',
}) => {
  return (
    <SimpleButton
      id={id}
      testId={testId}
      inverted={!isActive}
      ariaSelected={isActive}
      onClick={onClick}
      shape={shape}
      className={className}
      aria-controls={tabPanelId}
      role="tab"
    >
      {title}
    </SimpleButton>
  );
};
