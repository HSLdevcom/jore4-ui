import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { CloseIconButton, SimpleButton } from '../../../common/Buttons';
import { Row } from '../../../common/LayoutComponents';
import { MapDepotStop } from '../../Types';

const testIds = {
  label: 'DepotStopPopup::label',
  moveButton: 'DepotStopPopup::moveButton',
  editButton: 'DepotStopPopup::editButton',
  deleteButton: 'DepotStopPopup::deleteButton',
  closeButton: 'DepotStopPopup::closeButton',
};

type DepotStopPopupProps = {
  readonly depotStop: MapDepotStop;
  readonly onEdit: () => void;
  readonly onMove: () => void;
  readonly onDelete: () => void;
  readonly onClose: () => void;
  readonly isDeleting?: boolean;
};

export const DepotStopPopup: FC<DepotStopPopupProps> = ({
  depotStop,
  onEdit,
  onMove,
  onDelete,
  onClose,
  isDeleting = false,
}) => {
  const { t } = useTranslation();

  return (
    <Popup
      className="z-3 mt-5 min-w-96 p-2"
      anchor="top"
      longitude={depotStop.location.coordinates[0]}
      latitude={depotStop.location.coordinates[1]}
      closeOnClick={false}
      closeButton={false}
    >
      <Row className="items-center gap-3">
        <h3 className="text-lg" data-testid={testIds.label}>
          {depotStop.label}
        </h3>

        <CloseIconButton
          className="ml-auto"
          onClick={onClose}
          testId={testIds.closeButton}
        />
      </Row>
      <Row className="mt-4">
        <SimpleButton
          shape="round"
          className="h-[38px]"
          onClick={onDelete}
          disabled={isDeleting}
          inverted
          testId={testIds.deleteButton}
          tooltip={t(($) => $.map.deleteStop)}
        >
          <MdDelete role="presentation" className="text-xl" />
        </SimpleButton>

        <SimpleButton
          className="ml-auto"
          inverted
          onClick={onMove}
          testId={testIds.moveButton}
        >
          {t(($) => $.move)}
        </SimpleButton>

        <SimpleButton
          className="ml-2"
          onClick={onEdit}
          testId={testIds.editButton}
        >
          {t(($) => $.edit)}
        </SimpleButton>
      </Row>
    </Popup>
  );
};
