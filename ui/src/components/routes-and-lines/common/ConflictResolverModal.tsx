import { Description, DialogTitle } from '@headlessui/react';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  LineDefaultFieldsFragment,
  RouteUniqueFieldsFragment,
  ScheduledStopPointDefaultFieldsFragment,
} from '../../../generated/graphql';
import { mapPriorityToUiName } from '../../../i18n/uiNameMappings';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate } from '../../../time';
import { Priority } from '../../../types/enums';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { Row } from '../../common/LayoutComponents';
import { Modal, ModalBody } from '../../common/Modals';
import { RouteLabel } from '../../common/RouteLabel';

const testIds = {
  closeButton: 'ConflictResolverModal::closeButton',
};

type CommonConflictItem = {
  readonly validityStart?: DateTime;
  readonly validityEnd?: DateTime;
  readonly priority: Priority;
  readonly label: string;
  readonly variant?: number | null;
  readonly id: UUID;
  readonly href?: string;
};

export function mapRouteToCommonConflictItem(
  route: RouteUniqueFieldsFragment,
): CommonConflictItem {
  return {
    validityStart: route.validity_start ?? undefined,
    validityEnd: route.validity_end ?? undefined,
    priority: route.priority,
    label: route.label,
    variant: route.variant,
    id: route.route_id,
    href: routeDetails[Path.editRoute].getLink(route.route_id),
  };
}

export function mapLineToCommonConflictItem(
  line: LineDefaultFieldsFragment,
): CommonConflictItem {
  return {
    validityStart: line.validity_start ?? undefined,
    validityEnd: line.validity_end ?? undefined,
    priority: line.priority,
    label: line.label,
    id: line.line_id,
    href: routeDetails[Path.lineDetails].getLink(line.line_id),
  };
}

export function mapStopToCommonConflictItem(
  item: ScheduledStopPointDefaultFieldsFragment,
): CommonConflictItem {
  return {
    validityStart: item.validity_start ?? undefined,
    validityEnd: item.validity_end ?? undefined,
    priority: item.priority,
    label: item.label,
    id: item.scheduled_stop_point_id,
  };
}

type ConflictItemRowProps = {
  readonly item: CommonConflictItem;
};

const ConflictItemRow: FC<ConflictItemRowProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <tr
      className="[&>td]:border [&>td]:border-light-grey [&>td]:p-5"
      key={item.id}
    >
      <td>{mapPriorityToUiName(t, item.priority)}</td>
      <td>
        {mapToShortDate(item.validityStart) ??
          t(($) => $.saveChangesModal.indefinite)}
      </td>
      <td>
        {mapToShortDate(item.validityEnd) ??
          t(($) => $.saveChangesModal.indefinite)}
      </td>
      <td>
        {item.href ? (
          <Link to={item.href} className="text-brand">
            <RouteLabel label={item.label} variant={item.variant} />
          </Link>
        ) : (
          <RouteLabel label={item.label} variant={item.variant} />
        )}
      </td>
    </tr>
  );
};

type ConflictResolverModalProps = {
  readonly className?: string;
  readonly conflicts: ReadonlyArray<CommonConflictItem>;
  readonly isOpen?: boolean;
  readonly onClose: () => void;
};

export const ConflictResolverModal: FC<ConflictResolverModalProps> = ({
  onClose,
  className,
  conflicts,
  isOpen = conflicts.length > 0,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={className}>
      <ModalBody>
        <DialogTitle className="flex text-xl font-bold">
          {t(($) => $.saveChangesModal.validityConflictTitle)}
          <CloseIconButton
            className="ml-auto"
            onClick={onClose}
            testId={testIds.closeButton}
          />
        </DialogTitle>
        <Description>
          {t(($) => $.saveChangesModal.validityConflictBody)}
        </Description>

        <table className="mt-6">
          <thead>
            <tr className="[&>th]font-normal">
              <th>{t(($) => $.priority.label)}</th>
              <th>{t(($) => $.validityPeriod.validityStart)}</th>
              <th>{t(($) => $.validityPeriod.validityEnd)}</th>
              <th>{t(($) => $.lines.label)}</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map((item) => (
              <ConflictItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>

        <Row className="mt-14 justify-end">
          <SimpleButton onClick={onClose} inverted>
            {t(($) => $.cancel)}
          </SimpleButton>
        </Row>
      </ModalBody>
    </Modal>
  );
};
