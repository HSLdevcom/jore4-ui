import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateBackSafely } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { PageTitle } from '../../../common';
import { CloseIconButton } from '../../../common/Buttons';
import { Row } from '../../../common/LayoutComponents';

const testIds = {
  returnButton: 'LineChangeHistoryPage::ReturnButton',
  title: 'LineChangeHistoryPage::Title',
  names: 'LineChangeHistoryPage::Names',
};

type LineChangeHistoryPageTitleRowProps = {
  readonly names: LocalizedString | null;
  readonly label: string;
};

export const LineChangeHistoryPageTitleRow: FC<
  LineChangeHistoryPageTitleRowProps
> = ({ names, label }) => {
  const { t } = useTranslation();

  const goBack = useNavigateBackSafely();

  const name = names?.fi_FI ?? names?.sv_FI;
  const titleText = name
    ? t(($) => $.lineChangeHistory.titleWithName, { label, name })
    : t(($) => $.lineChangeHistory.title, { label });

  return (
    <>
      <Row className="items-end justify-between">
        <PageTitle.H1 titleText={titleText} testId={testIds.title}>
          {t(($) => $.lineChangeHistory.title, { label })}
        </PageTitle.H1>

        <CloseIconButton
          className="font-bold text-brand [&>i]:text-xl"
          onClick={() =>
            goBack(routeDetails[Path.lineDetails].getLink(label), {
              replace: true,
            })
          }
          testId={testIds.returnButton}
          label={t(($) => $.lineChangeHistory.goBack)}
        />
      </Row>

      {names && (
        <h2 data-testid={testIds.names}>
          <span>{names.fi_FI ?? ''}</span>
          {' - '}
          <span>{names.sv_FI ?? ''}</span>
        </h2>
      )}
    </>
  );
};
