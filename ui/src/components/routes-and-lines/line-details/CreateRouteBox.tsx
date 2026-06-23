import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { SimpleButton } from '../../../uiComponents';
import { Column } from '../../common/LayoutComponents';

type CreateRouteBoxProps = {
  readonly className?: string;
  readonly onCreateRoute?: () => void;
};

export const CreateRouteBox: FC<CreateRouteBoxProps> = ({
  className,
  onCreateRoute,
}) => {
  const { t } = useTranslation();

  return (
    <Column
      className={twJoin(
        'items-center border border-light-grey bg-background p-8',
        className,
      )}
    >
      {onCreateRoute && (
        <SimpleButton
          id="create-route-button"
          className="mb-4"
          onClick={onCreateRoute}
        >
          {t(($) => $.lines.createNewRoute)}
        </SimpleButton>
      )}
      {onCreateRoute ? (
        <span>{t(($) => $.lines.createNewRouteInstructions)}</span>
      ) : (
        <span>{t(($) => $.lines.cannotCreateRoute)}</span>
      )}
    </Column>
  );
};
