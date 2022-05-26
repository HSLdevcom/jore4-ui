import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViaModal } from '../../hooks';
import { Row, Visible } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';
import { ViaForm } from './ViaForm';

interface HeaderProps {
  onClose: () => void;
  heading: string;
}

const ModalHeader = ({ onClose, heading }: HeaderProps): JSX.Element => {
  return (
    <div className="border border-light-grey bg-background px-14 py-7">
      <Row>
        <p className="text-2xl font-bold">{heading}</p>
        <CloseIconButton className="ml-auto" onClick={onClose} />
      </Row>
    </div>
  );
};

interface Props {
  className?: string;
}

export const ViaModal = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { stopInfo, defaultValues, onSubmit, onRemove, onClose } =
    useViaModal();

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-auto overflow-y-auto bg-white  drop-shadow-md ${className}`}
    >
      <ModalHeader
        onClose={onClose}
        heading={t('viaModal.viaModalTitle', {
          label: stopInfo?.journey_pattern.journey_pattern_route?.label,
        })}
      />
      <Visible visible={!!stopInfo}>
        <ViaForm
          className="p-8"
          onCancel={onClose}
          onSubmit={onSubmit}
          onRemove={onRemove}
          defaultValues={defaultValues}
        />
      </Visible>
    </div>
  );
};
