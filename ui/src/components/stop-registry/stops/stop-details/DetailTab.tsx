import { SimpleSmallButton } from '../../../../uiComponents';

interface Props {
  id: string;
  tabPanelId: string;
  testId: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const DetailTab = ({
  id,
  tabPanelId,
  testId,
  title,
  isActive,
  onClick,
  className = '',
}: Props): JSX.Element => {
  return (
    <SimpleSmallButton
      id={id}
      testId={testId}
      inverted={!isActive}
      ariaSelected={isActive}
      onClick={onClick}
      label={title}
      className={`py-1 px-4 ${className}`}
      aria-controls={tabPanelId}
      role="tab"
    />
  );
};
