import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedStopPlace } from '../../../hooks';
import { Path, routeDetails } from '../../../router/routeDetails';
import { DialogWithButtons } from '../../../uiComponents';

const testIds = {
  // Reuse generic ConformDialog testIds, to minimize test changes.
  cancelButton: 'ConfirmationDialog::cancelButton',
  confirmButton: 'ConfirmationDialog::confirmButton',
  linkToMemberStop: (publicCode: string) =>
    `ConfirmStopAreaDeletionDialog::memberStopLink::${publicCode}`,
};

type ConfirmationContent = {
  readonly body: ReactNode;
  readonly isDeletable: boolean;
};

function getDeleteBlockedContent(
  t: TFunction,
  stopArea: EnrichedStopPlace,
): ConfirmationContent {
  return {
    body: (
      <div>
        <p>{t('confirmStopAreaDeletionDialog.bodyCanNotBeDeleted')}</p>
        <p className="mb-2 mt-4">
          {t('confirmStopAreaDeletionDialog.memberStops')}
        </p>
        <ul>
          {compact(stopArea.quays).map((quay) => (
            <li key={quay?.id}>
              <a
                href={routeDetails[Path.stopDetails].getLink(quay.publicCode)}
                target="_blank"
                rel="noreferrer"
                data-testid={testIds.linkToMemberStop(quay.publicCode ?? '')}
                title={t('accessibility:stops.showStopDetails', {
                  stopLabel: quay.publicCode,
                })}
              >
                <b>{quay.publicCode}</b>{' '}
                <span>{quay.description?.value ?? ''}</span>
                <i className="icon-open-in-new" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    ),
    isDeletable: false,
  };
}

function getConfirmationContent(
  t: TFunction,
  stopArea: EnrichedStopPlace,
): ConfirmationContent {
  if (compact(stopArea.quays).length) {
    return getDeleteBlockedContent(t, stopArea);
  }

  return {
    body: t('confirmStopAreaDeletionDialog.bodyCanBeDeleted'),
    isDeletable: true,
  };
}

type ConfirmStopAreaDeletionDialogProps = {
  readonly className?: string;
  readonly isOpen: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly stopArea: EnrichedStopPlace;
};

export const ConfirmStopAreaDeletionDialog: FC<
  ConfirmStopAreaDeletionDialogProps
> = ({ isOpen, onConfirm, onCancel, className = '', stopArea }) => {
  const { t } = useTranslation();

  const { body, isDeletable } = getConfirmationContent(t, stopArea);

  return (
    <DialogWithButtons
      className={className}
      isOpen={isOpen}
      title={t('confirmStopAreaDeletionDialog.title')}
      description={body}
      buttons={compact([
        {
          text: t('cancel'),
          onClick: onCancel,
          inverted: true,
          testId: testIds.cancelButton,
        },
        isDeletable
          ? {
              text: t('confirmStopAreaDeletionDialog.confirmText'),
              onClick: onConfirm,
              testId: testIds.confirmButton,
            }
          : null,
      ])}
      onCancel={onCancel}
      widthClassName="max-w-md"
    />
  );
};
