import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../hooks';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';
import { ExpandableInfoContainer } from './ExpandableInfoContainer';

interface Props {
  stop: StopWithDetails;
}

export const BasicDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.basicDetails')}
      testIdPrefix="BasicDetailsSection"
    >
      <BasicDetailsViewCard stop={stop} />
    </ExpandableInfoContainer>
  );
};
