import compact from 'lodash/compact';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { StopWithDetails, useToggle } from '../../../../../hooks';
import { ExpandableInfoContainer } from '../layout';
import { SheltersViewList } from './SheltersViewList';

interface Props {
  stop: StopWithDetails;
}

export const SheltersSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);
  const onCancel = () => {
    toggleEditMode();
  };

  const shelters: Array<ShelterEquipmentDetailsFragment> = compact(
    stop.stop_place?.quays?.[0]?.placeEquipments?.shelterEquipment || [],
  );

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.shelters.title', { count: shelters.length })}
      testIdPrefix="SheltersSection"
      isEditMode={isEditMode}
      onCancel={onCancel}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode ? (
        <h2>Edit mode TODO</h2>
      ) : (
        <SheltersViewList shelters={shelters} />
      )}
    </ExpandableInfoContainer>
  );
};
