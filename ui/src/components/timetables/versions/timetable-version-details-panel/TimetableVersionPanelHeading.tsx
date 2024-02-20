import { t } from 'i18next';
import { DateTime } from 'luxon';
import { Row } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { CloseIconButton } from '../../../../uiComponents';

const testIds = {
  closeButton: 'TimetableVersionPanelHeading::closeButton',
};

export const TimetableVersionPanelHeading: React.FC<{
  onClose: () => void;
  validityStart?: DateTime;
  validityEnd?: DateTime;
}> = ({ validityStart, validityEnd, onClose }) => (
  <Row className="mb-4 ml-2 justify-between">
    <div>
      <span className="block font-bold">{t('timetables.scheduleValid')}</span>
      <span className="text-xl font-bold">{`${mapToShortDate(
        validityStart,
      )} - ${mapToShortDate(validityEnd)}`}</span>
    </div>
    <CloseIconButton
      label={t('close')}
      className="text-base font-bold text-brand"
      onClick={onClose}
      testId={testIds.closeButton}
    />
  </Row>
);
