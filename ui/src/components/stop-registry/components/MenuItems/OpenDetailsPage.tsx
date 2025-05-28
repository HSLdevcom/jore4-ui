import qs from 'qs';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { Priority } from '../../../../types/enums';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import { LocatableStopWithObservationDateProps } from '../../types';

const testIds = {
  showStopDetails: 'StopTableRow::ActionMenu::ShowStopDetails',
};

type OpenDetailsPageProps = LocatableStopWithObservationDateProps & {
  readonly priority?: Priority;
};

const OpenDetailsPageImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  OpenDetailsPageProps
> = ({ className, observationDate, priority, stop }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const pathname = routeDetails[Path.stopDetails].getLink(stop.label);
  const search = qs.stringify(
    { observationDate: observationDate?.toISODate(), priority },
    { addQueryPrefix: true },
  );

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      text={t('stopRegistrySearch.stopRowActions.openDetails')}
      onClick={() => navigate({ pathname, search })}
      testId={testIds.showStopDetails}
    />
  );
};

export const OpenDetailsPage = forwardRef(OpenDetailsPageImpl);
