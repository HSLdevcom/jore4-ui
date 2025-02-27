import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import { LocatableStopProps } from '../../types';

const testIds = {
  showStopDetails: 'StopTableRow::ActionMenu::ShowStopDetails',
};

const OpenDetailsPageImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  LocatableStopProps
> = ({ className, stop }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      text={t('stopRegistrySearch.stopRowActions.openDetails')}
      onClick={() =>
        navigate(routeDetails[Path.stopDetails].getLink(stop.label))
      }
      testId={testIds.showStopDetails}
    />
  );
};

export const OpenDetailsPage = forwardRef(OpenDetailsPageImpl);
