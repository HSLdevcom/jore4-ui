import { StopRegistryGroupOfStopPlaces } from '../../../generated/graphql';
import { StopAreaPopup } from './StopAreaPopup';

type EditStopAreaLayerProps = {
  editedArea: StopRegistryGroupOfStopPlaces;
  onPopupClose: () => void;
};

export const EditStopAreaLayer = ({
  editedArea,
  onPopupClose,
}: EditStopAreaLayerProps) => {
  return <StopAreaPopup area={editedArea} onClose={onPopupClose} />;
};
