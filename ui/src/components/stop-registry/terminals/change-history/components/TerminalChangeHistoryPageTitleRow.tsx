import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateBackSafely } from '../../../../../hooks';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { PageTitle } from '../../../../common';
import { CloseIconButton } from '../../../../common/Buttons';
import { Row } from '../../../../common/LayoutComponents';
import { TodaysName } from '../../../stops/change-history/types';

const testIds = {
  returnButton: 'TerminalChangeHistoryPage::ReturnButton',
  title: 'TerminalChangeHistoryPage::Title',
  names: 'TerminalChangeHistoryPage::Names',
};

type TerminalChangeHistoryPageTitleRowProps = {
  readonly names: TodaysName | null;
  readonly privateCode: string;
};

export const TerminalChangeHistoryPageTitleRow: FC<
  TerminalChangeHistoryPageTitleRowProps
> = ({ names, privateCode }) => {
  const { t } = useTranslation();

  const goBack = useNavigateBackSafely();

  const name = names?.name ?? names?.nameSwe;
  const titleText = name
    ? t(($) => $.terminalChangeHistory.titleWithName, { privateCode, name })
    : t(($) => $.terminalChangeHistory.title, { privateCode });

  return (
    <>
      <Row className="items-end justify-between">
        <PageTitle.H1 titleText={titleText} testId={testIds.title}>
          {t(($) => $.terminalChangeHistory.title, { privateCode })}
        </PageTitle.H1>

        <CloseIconButton
          className="font-bold text-brand [&>i]:text-xl"
          onClick={() =>
            goBack(routeDetails[Path.terminalDetails].getLink(privateCode), {
              replace: true,
            })
          }
          testId={testIds.returnButton}
          label={t(($) => $.terminalChangeHistory.goBack)}
        />
      </Row>

      {names && (
        <h2 data-testid={testIds.names}>
          <span>{names.name ?? ''}</span>
          {' - '}
          <span>{names.nameSwe ?? ''}</span>
        </h2>
      )}
    </>
  );
};
