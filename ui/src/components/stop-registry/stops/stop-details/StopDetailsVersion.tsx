import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { makeBackNavigationIsSafeState, useUrlQuery } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../../common/Buttons';
import { Row } from '../../../common/LayoutComponents';
import { ObservationDateControl } from '../../../common/ObservationDateControl';

const testIds = {
  returnToDateBasedVersionSelection:
    'StopDetailsVersion::returnToDateBasedVersionSelection',
  goToVersions: 'StopDetailsPage::goToVersions',
};

type StopDetailsVersionProps = { readonly label: string };

export const StopDetailsVersion: FC<StopDetailsVersionProps> = ({ label }) => {
  const { t } = useTranslation();

  const {
    queryParams: { priority },
    deleteFromUrlQuery,
  } = useUrlQuery();

  return (
    <Row className="items-end justify-end gap-4">
      {priority ? (
        <Row className="mx-auto items-center rounded-sm bg-city-bicycle-yellow px-4 py-2">
          <span className="mr-4 font-bold">
            {t(($) => $.stopDetails.selectedVersion.showingSelected)}
          </span>
          <CloseIconButton
            className="underline"
            label={t(($) => $.stopDetails.selectedVersion.showByDate)}
            onClick={() =>
              deleteFromUrlQuery({ paramName: 'priority', replace: true })
            }
            testId={testIds.returnToDateBasedVersionSelection}
          />
        </Row>
      ) : (
        <ObservationDateControl className="col-start-6" />
      )}
      <SimpleButton
        inverted
        href={{ pathname: routeDetails[Path.stopVersions].getLink(label) }}
        state={makeBackNavigationIsSafeState()}
        testId={testIds.goToVersions}
      >
        {t(($) => $.stopDetails.actions.showVersions)}
      </SimpleButton>
    </Row>
  );
};
