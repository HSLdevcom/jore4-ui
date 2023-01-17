import { Dialog } from '@headlessui/react';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  RouteLine,
  RouteRoute,
  ServicePatternScheduledStopPoint,
} from '../../../generated/graphql';
import { mapPriorityToUiName } from '../../../i18n/uiNameMappings';
import { Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate } from '../../../time';
import { Priority } from '../../../types/Priority';
import {
  CloseIconButton,
  Modal,
  ModalBody,
  SimpleButton,
} from '../../../uiComponents';
import { RouteLabel } from '../../common/RouteLabel';

interface Props {
  onClose: () => void;
  className?: string;
  conflicts?: CommonConflictItem[];
}

const Th: React.FC = ({ children }) => (
  <th className="font-normal">{children}</th>
);

const Td: React.FC = ({ children }) => (
  <td className="border border-light-grey p-5">{children}</td>
);

interface CommonConflictItem {
  validityStart?: DateTime;
  validityEnd?: DateTime;
  priority: Priority;
  label: string;
  variant?: number | null;
  id: UUID;
  href?: string;
}

export const mapRouteToCommonConflictItem = (
  route: RouteRoute,
): CommonConflictItem => ({
  validityStart: route.validity_start || undefined,
  validityEnd: route.validity_end || undefined,
  priority: route.priority,
  label: route.label,
  variant: route.variant,
  id: route.route_id,
  href: routeDetails[Path.editRoute].getLink(route.route_id),
});

export const mapLineToCommonConflictItem = (
  line: RouteLine,
): CommonConflictItem => ({
  validityStart: line.validity_start || undefined,
  validityEnd: line.validity_end || undefined,
  priority: line.priority,
  label: line.label,
  id: line.line_id,
  href: routeDetails[Path.lineDetails].getLink(line.line_id),
});

export const mapStopToCommonConflictItem = (
  item: ServicePatternScheduledStopPoint,
): CommonConflictItem => ({
  validityStart: item.validity_start || undefined,
  validityEnd: item.validity_end || undefined,
  priority: item.priority,
  label: item.label,
  id: item.scheduled_stop_point_id,
});

const ConflictItemRow = ({
  item,
}: {
  item: CommonConflictItem;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <tr key={item.id}>
      <Td>{mapPriorityToUiName(item.priority)}</Td>
      <Td>
        {mapToShortDate(item.validityStart) || t('saveChangesModal.indefinite')}
      </Td>
      <Td>
        {mapToShortDate(item.validityEnd) || t('saveChangesModal.indefinite')}
      </Td>
      <Td>
        {item.href ? (
          <Link to={item.href} className="text-brand">
            <RouteLabel route={item} />
          </Link>
        ) : (
          <RouteLabel route={item} />
        )}
      </Td>
    </tr>
  );
};

export const ConflictResolverModal: React.FC<Props> = ({
  onClose,
  className = '',
  conflicts = [],
}) => {
  const { t } = useTranslation();
  const isOpen = !!conflicts.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <ModalBody>
        <Dialog.Title className="flex text-xl font-bold">
          {t('saveChangesModal.validityConflictTitle')}
          <CloseIconButton className="ml-auto" onClick={onClose} />
        </Dialog.Title>
        <Dialog.Description>
          {t('saveChangesModal.validityConflictBody')}
        </Dialog.Description>

        <table className="mt-6">
          <thead>
            <tr>
              <Th>{t('priority.label')}</Th>
              <Th>{t('validityPeriod.validityStart')}</Th>
              <Th>{t('validityPeriod.validityEnd')}</Th>
              <Th>{t('lines.label')}</Th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map((item) => (
              <ConflictItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>

        <Row>
          <SimpleButton
            containerClassName="ml-auto mt-14"
            onClick={onClose}
            inverted
          >
            {t('cancel')}
          </SimpleButton>
        </Row>
      </ModalBody>
    </Modal>
  );
};
