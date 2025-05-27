import { t } from 'i18next';
import { DateTime } from 'luxon';
import { Row } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { CloseIconButton } from '../../../../uiComponents';

const testIds = {
  heading: 'TimetableVersionPanelHeading::heading',
  closeButton: 'TimetableVersionPanelHeading::closeButton',
};

type TimetableVersionPanelHeadingProps = {
  readonly onClose: () => void;
  readonly validityStart?: DateTime;
  readonly validityEnd?: DateTime;
};

export const TimetableVersionPanelHeading: React.FC<
  TimetableVersionPanelHeadingProps
> = ({ validityStart, validityEnd, onClose }) => (
  <Row className="mb-4 ml-2 justify-between">
    <h2 data-testid={testIds.heading}>
      <span className="block text-sm">{t('timetables.scheduleValid')}</span>
      <span className="text-2xl">{`${mapToShortDate(
        validityStart,
      )} - ${mapToShortDate(validityEnd)}`}</span>
    </h2>
    <CloseIconButton
      label={t('close')}
      className="text-base font-bold text-brand"
      onClick={onClose}
      testId={testIds.closeButton}
    />
  </Row>
);
