import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../hooks';
import { ExpandableInfoContainer } from './ExpandableInfoContainer';
import { SignageDetailsViewCard } from './SignageDetailsViewCard';

interface Props {
  stop: StopWithDetails;
}

export const SignageDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.signs.title')}
    >
      <SignageDetailsViewCard stop={stop} />
    </ExpandableInfoContainer>
  );
};
