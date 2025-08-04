import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { SimpleDropdownMenuItem } from '../../../../../uiComponents';

type OpenDetailsProps = {
  readonly className?: string;
  readonly privateCode: string | null | undefined;
  readonly testId: string;
};

export const OpenDetails = forwardRef<HTMLButtonElement, OpenDetailsProps>(
  ({ className, privateCode, testId }, ref) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { observationDate } = useObservationDateQueryParam({
      initialize: false,
    });

    return (
      <SimpleDropdownMenuItem
        className={className}
        text={t('stopRegistrySearch.stopAreaRowActions.openDetails')}
        onClick={() =>
          navigate(
            routeDetails[Path.stopAreaDetails].getLink(privateCode, {
              observationDate,
            }),
          )
        }
        testId={testId}
        ref={ref}
        disabled={!privateCode}
      />
    );
  },
);

OpenDetails.displayName = 'OpenDetails';
