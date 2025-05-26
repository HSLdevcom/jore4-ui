import { TFunction } from 'i18next';
import countBy from 'lodash/countBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteUniqueFieldsFragment } from '../../../generated/graphql';
import { EditChanges } from '../../../hooks';
import { ConfirmationDialog } from '../../../uiComponents';

type EditStopConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly className?: string;
  readonly editChanges: EditChanges;
};

/**
 * Builds a string list from provided routes' labels separated by comma.
 * If multiple instances of a route are in the provided route array,
 * add count of route instances after the label.
 *
 * Example output: "65x, 65y (5 versions), 65z (3 versions)"
 */
export const buildRouteLabelListString = (
  routes: ReadonlyArray<RouteUniqueFieldsFragment>,
  t: TFunction,
) => {
  const labelsCounted = countBy(routes, 'label');

  return Object.entries(labelsCounted)
    .map(([routeLabel, labelCount]) =>
      // Only display count if it is greater than 1
      labelCount > 1
        ? t('confirmEditStopDialog.routeWithNVersions', {
            routeLabel,
            labelCount,
          })
        : routeLabel,
    )
    .join(', ');
};

/** Renders a confirmation dialog for confirming changes when a stop is edited */
export const EditStopConfirmationDialog: FC<
  EditStopConfirmationDialogProps
> = ({ isOpen, onConfirm, onCancel, className = '', editChanges }) => {
  const { t } = useTranslation();

  // TODO improve the confirmation dialog when Design has iterated on how this should look like
  const buildDescription = (changes: EditChanges) => {
    const editedStopText = t('confirmEditStopDialog.description', {
      stopLabel: changes.editedStop.label,
    });
    const confirmationTextParts: string[] = [editedStopText];

    // if stop is deleted from some routes, list them
    if (changes.deleteStopFromRoutes.length > 0) {
      const routeLabels = buildRouteLabelListString(
        changes.deleteStopFromRoutes,
        t,
      );
      const removedRoutesText = t('confirmEditStopDialog.removedFromRoutes', {
        routeLabels,
      });
      confirmationTextParts.push(removedRoutesText);
    }

    return confirmationTextParts.join('\n\n');
  };

  return (
    <ConfirmationDialog
      className={className}
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t('confirmEditStopDialog.title')}
      description={buildDescription(editChanges)}
      confirmText={t('confirmEditStopDialog.confirmText')}
      cancelText={t('cancel')}
      widthClassName="w-235"
    />
  );
};
