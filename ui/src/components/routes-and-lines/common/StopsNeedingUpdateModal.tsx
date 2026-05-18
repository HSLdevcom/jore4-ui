import { Description, DialogTitle } from '@headlessui/react';
import uniq from 'lodash/uniq';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../generated/graphql';
import { Row } from '../../../layoutComponents';
import { Modal, ModalBody, SimpleButton } from '../../../uiComponents';
import { StopsList } from '../../common/ChangeHistory';
import { StopMetaTypeUpdateInfo } from './useUpdateStopRegistryStopMetatype';

const testIds = {
  modal: 'StopsNeedingUpdateModal::modal',
  cancelButton: 'StopsNeedingUpdateModal::cancelButton',
  confirmButton: 'StopsNeedingUpdateModal::confirmButton',
  stopLink: (publicCode: string) =>
    `StopsNeedingUpdateModal::stopLink::${publicCode}`,
};

type StopsNeedingUpdateModalProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly isOpen: boolean;
  readonly stops: ReadonlyArray<StopMetaTypeUpdateInfo>;
  readonly typeOfLine: RouteTypeOfLineEnum | undefined | null;
};

export const StopsNeedingUpdateModal: FC<StopsNeedingUpdateModalProps> = ({
  className,
  onCancel,
  onConfirm,
  isOpen,
  stops,
  typeOfLine,
}) => {
  const { t } = useTranslation();

  const getBodyContent = () => {
    switch (typeOfLine) {
      case RouteTypeOfLineEnum.ExpressBusService:
        return t(($) => $.confirmAutoUpdateStops.bodyTrunkLine);

      case RouteTypeOfLineEnum.RegionalTramService:
        return t(($) => $.confirmAutoUpdateStops.bodySpeedTram);

      default:
        return null;
    }
  };

  const affectedStopList = uniq(stops.map((it) => it.publicCode)).sort();

  return (
    <Modal
      contentClassName={className}
      isOpen={isOpen}
      onClose={onCancel}
      testId={testIds.modal}
    >
      <ModalBody className="max-w-[500px]">
        <DialogTitle className="flex text-xl font-bold">
          {t(($) => $.confirmAutoUpdateStops.title)}
        </DialogTitle>

        <Description as="div" className="my-4">
          <p className="mb-4">{getBodyContent()}</p>
          <StopsList
            t={t}
            stopLabels={affectedStopList}
            getLinkTestId={testIds.stopLink}
          />
        </Description>

        <Row className="justify-end gap-4">
          <SimpleButton
            onClick={onCancel}
            inverted
            testId={testIds.cancelButton}
          >
            {t(($) => $.cancel)}
          </SimpleButton>
          <SimpleButton onClick={onConfirm} testId={testIds.confirmButton}>
            {t(($) => $.confirmAutoUpdateStops.confirm)}
          </SimpleButton>
        </Row>
      </ModalBody>
    </Modal>
  );
};
