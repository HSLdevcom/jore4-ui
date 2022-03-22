import { useTranslation } from 'react-i18next';

type Props = {
  onClick: () => void;
  className: string;
};

export const CloseButton = ({
  onClick,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <button className={className} type="button" onClick={onClick}>
      {t('close')}
      <i className="icon-close-large ml-4 text-lg" />
    </button>
  );
};
