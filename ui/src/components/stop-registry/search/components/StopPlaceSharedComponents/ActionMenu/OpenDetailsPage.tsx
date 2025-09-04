import { forwardRef } from 'react';
import { useNavigate } from 'react-router';
import { useObservationDateQueryParam } from '../../../../../../hooks';
import { PathValue, routeDetails } from '../../../../../../router/routeDetails';
import { SimpleDropdownMenuItem } from '../../../../../../uiComponents';

type OpenDetailsProps = {
  readonly className?: string;
  readonly privateCode: string | null | undefined;
  readonly testId: string;
  readonly text: string;
  readonly details: PathValue;
};

export const OpenDetails = forwardRef<HTMLButtonElement, OpenDetailsProps>(
  ({ className, privateCode, testId, text, details }, ref) => {
    const navigate = useNavigate();

    const { observationDate } = useObservationDateQueryParam({
      initialize: false,
    });

    return (
      <SimpleDropdownMenuItem
        className={className}
        text={text}
        onClick={() =>
          navigate(
            routeDetails[details].getLink(privateCode, {
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
