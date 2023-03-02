import { useTranslation } from 'react-i18next';
import { Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';

const testIds = {
  closeButton: 'RouteBreadcrumb::closeButton',
};

export interface Props {
  lineLabel: string;
  routeLabel: string;
  onClose: () => void;
}

/**
 * Displays breadcrumb for a route inside a line
 */
export const RouteBreadcrumb = ({
  lineLabel,
  routeLabel,
  onClose,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Row className="bg-lighter-grey items-center justify-between border-y border-background px-12 py-4 font-bold text-brand">
      <Row className="items-center space-x-4">
        <p className="">{t('lines.line', { label: lineLabel })}</p>
        <i className="icon-arrow-2 -rotate-90" />
        <p className="text-hsl-dark-80">{`${t(
          'routes.route',
        )} ${routeLabel}`}</p>
        <i className="icon-arrow-2" />
      </Row>
      <CloseIconButton
        className="ml-auto font-bold text-brand"
        label={t('close')}
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
