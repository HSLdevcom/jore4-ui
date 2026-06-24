import { TFunction } from 'i18next';
import countBy from 'lodash/countBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteUniqueFieldsFragment } from '../../../../../generated/graphql';
import { ConfirmationDialog } from '../../../../../uiComponents';

const buildRouteLabels = (
  routes: ReadonlyArray<RouteUniqueFieldsFragment>,
  t: TFunction,
) => {
  const labelsCounted = countBy(routes, 'label');

  return Object.entries(labelsCounted).map(([routeLabel, labelCount]) =>
    labelCount > 1
      ? t(($) => $.confirmEditStopDialog.routeWithNVersions, {
          routeLabel,
          labelCount,
        })
      : routeLabel,
  );
};

type StopStateChangeConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly stopLabel: string;
  readonly affectedRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

export const StopStateChangeConfirmationDialog: FC<
  StopStateChangeConfirmationDialogProps
> = ({ isOpen, onConfirm, onCancel, stopLabel, affectedRoutes }) => {
  const { t } = useTranslation();

  const description = (
    <div className="space-y-4">
      <p>
        {t(($) => $.confirmStopStateChangeDialog.description, { stopLabel })}
      </p>
      {affectedRoutes.length > 0 && (
        <div>
          <p>{t(($) => $.confirmStopStateChangeDialog.affectedRoutes)}</p>
          <ul className="mt-1 ml-4 list-disc">
            {buildRouteLabels(affectedRoutes, t).map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      )}
      <p>{t(($) => $.confirmStopStateChangeDialog.routesNotModified)}</p>
    </div>
  );

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t(($) => $.confirmStopStateChangeDialog.title)}
      description={description}
      confirmText={t(($) => $.confirmStopStateChangeDialog.confirmText)}
      cancelText={t(($) => $.cancel)}
      widthClassName="w-235"
    />
  );
};
