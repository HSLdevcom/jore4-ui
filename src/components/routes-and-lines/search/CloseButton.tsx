import { useTranslation } from 'react-i18next';

export const CloseButton = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();

  return (
    <button
      className="ml-auto text-base font-bold text-brand"
      type="button"
      onClick={onClose}
    >
      {t('close')}
      <i className="icon-close-large ml-4 text-lg" />
    </button>
  );
};
