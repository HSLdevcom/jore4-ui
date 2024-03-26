import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../hooks';
import { ExpandableInfoContainer } from './ExpandableInfoContainer';
import { LocationDetailsViewCard } from './LocationDetailsViewCard';

interface Props {
  stop: StopWithDetails;
}

export const LocationDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.location.title')}
      testIdPrefix="LocationDetailsSection"
    >
      <LocationDetailsViewCard stop={stop} />
    </ExpandableInfoContainer>
  );
};
