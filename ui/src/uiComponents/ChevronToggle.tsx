import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from './IconButton';

type Props = {
  isToggled: boolean;
  testId?: string;
  onClick: () => void;
  controls: string;
};

export const ChevronToggle = ({
  isToggled,
  onClick,
  testId,
  controls,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const iconClassName = 'text-3xl text-tweaked-brand';
  return (
    <IconButton
      title={
        isToggled
          ? t('accessibility:button.shrinkSearch')
          : t('accessibility:button.expandSearch')
      }
      onClick={onClick}
      icon={
        isToggled ? (
          <FaChevronUp className={iconClassName} aria-hidden />
        ) : (
          <FaChevronDown className={iconClassName} aria-hidden />
        )
      }
      ariaAttributes={{
        ariaExpanded: isToggled,
        ariaControls: controls,
      }}
      testId={testId}
    />
  );
};
