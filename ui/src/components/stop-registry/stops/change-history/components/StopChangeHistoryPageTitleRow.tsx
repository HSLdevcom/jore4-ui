import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateBackSafely } from '../../../../../hooks';
import { Row } from '../../../../../layoutComponents';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { CloseIconButton } from '../../../../../uiComponents';
import { PageTitle } from '../../../../common';

const testIds = {
  returnButton: 'StopChangeHistoryPage::returnButton',
  title: 'StopChangeHistoryPage::title',
};

type StopChangeHistoryPageTitleRowProps = {
  readonly name: string | null;
  readonly publicCode: string;
};

export const StopChangeHistoryPageTitleRow: FC<
  StopChangeHistoryPageTitleRowProps
> = ({ name, publicCode }) => {
  const { t } = useTranslation();

  const goBack = useNavigateBackSafely();

  const titleText = name
    ? t('stopChangeHistory.titleWithName', { publicCode, name })
    : t(t('stopChangeHistory.title', { publicCode }));

  return (
    <Row className="items-end justify-between">
      <PageTitle.H1 titleText={titleText} testId={testIds.title}>
        {t('stopChangeHistory.title', { publicCode })}
      </PageTitle.H1>

      <CloseIconButton
        className="font-bold text-brand [&>i]:text-xl"
        onClick={() =>
          goBack(routeDetails[Path.stopDetails].getLink(publicCode), {
            replace: true,
          })
        }
        testId={testIds.returnButton}
        label={t('stopChangeHistory.goBack')}
      />
    </Row>
  );
};
