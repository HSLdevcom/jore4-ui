import { DateTime } from 'luxon';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router';
import { PathValue, routeDetails } from '../../../../../../router/routeDetails';
import { SimpleDropdownMenuItem } from '../../../../../../uiComponents';

type OpenDetailsProps = {
  readonly className?: string;
  readonly observationDate: DateTime;
  readonly privateCode: string | null | undefined;
  readonly testId: string;
  readonly text: string;
  readonly details: PathValue;
};

export const OpenDetails = forwardRef<HTMLButtonElement, OpenDetailsProps>(
  ({ className, details, observationDate, privateCode, testId, text }, ref) => {
    const navigate = useNavigate();

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
