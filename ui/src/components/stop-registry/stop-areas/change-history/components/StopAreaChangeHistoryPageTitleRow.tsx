import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateBackSafely } from '../../../../../hooks';
import { Row } from '../../../../../layoutComponents';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { CloseIconButton } from '../../../../../uiComponents';
import { PageTitle } from '../../../../common';
import { TodaysName } from '../../../stops/change-history/types';

const testIds = {
  returnButton: 'StopAreaChangeHistoryPage::ReturnButton',
  title: 'StopAreaChangeHistoryPage::Title',
  names: 'StopAreaChangeHistoryPage::Names',
};

type StopAreaChangeHistoryPageTitleRowProps = {
  readonly names: TodaysName | null;
  readonly privateCode: string;
};

export const StopAreaChangeHistoryPageTitleRow: FC<
  StopAreaChangeHistoryPageTitleRowProps
> = ({ names, privateCode }) => {
  const { t } = useTranslation();

  const goBack = useNavigateBackSafely();

  const name = names?.name ?? names?.nameSwe;
  const titleText = name
    ? t(($) => $.stopAreaChangeHistory.titleWithName, { privateCode, name })
    : t(($) => $.stopAreaChangeHistory.title, { privateCode });

  return (
    <>
      <Row className="items-end justify-between">
        <PageTitle.H1 titleText={titleText} testId={testIds.title}>
          {t(($) => $.stopAreaChangeHistory.title, { privateCode })}
        </PageTitle.H1>

        <CloseIconButton
          className="font-bold text-brand [&>i]:text-xl"
          onClick={() =>
            goBack(routeDetails[Path.stopAreaDetails].getLink(privateCode), {
              replace: true,
            })
          }
          testId={testIds.returnButton}
          label={t(($) => $.stopAreaChangeHistory.goBack)}
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
