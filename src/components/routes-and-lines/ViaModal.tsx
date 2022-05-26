import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViaModal } from '../../hooks';
import { Visible } from '../../layoutComponents';
import { ModalHeader } from '../common';
import { ViaForm } from './ViaForm';

interface Props {
  className?: string;
}

export const ViaModal = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { stopInfo, defaultValues, onSubmit, onRemove, onClose } =
    useViaModal();

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-auto overflow-y-auto bg-white drop-shadow-md ${className}`}
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
