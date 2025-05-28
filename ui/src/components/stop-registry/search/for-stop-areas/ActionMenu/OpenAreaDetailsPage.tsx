import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { SimpleDropdownMenuItem } from '../../../../../uiComponents';

type OpenDetailsProps = {
  readonly className?: string;
  readonly netexId: string | null | undefined;
  readonly testId: string;
};

export const OpenDetails = forwardRef<HTMLButtonElement, OpenDetailsProps>(
  ({ className, netexId, testId }, ref) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
      <SimpleDropdownMenuItem
        className={className}
        text={t('stopRegistrySearch.stopAreaRowActions.openDetails')}
        onClick={() =>
          navigate(routeDetails[Path.stopAreaDetails].getLink(netexId))
        }
        testId={testId}
        ref={ref}
        disabled={!netexId}
      />
    );
  },
);

OpenDetails.displayName = 'OpenDetails';
