import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';

const testIds = {
  closeButton: 'RouteBreadcrumb::closeButton',
};

export type TimetableNavigationProps = {
  readonly onClose: () => void;
};

/**
 * Displays close button. Might include breadcrumb in the future
 */
export const TimetableNavigation: FC<TimetableNavigationProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="items-center justify-end border-y border-background bg-lighter-grey px-12 py-4 font-bold text-brand">
      <CloseIconButton
        className="font-bold text-brand"
        label={t('close')}
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
