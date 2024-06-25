import { StopAreaMinimalShowOnMapFieldsFragment } from '../../../generated/graphql';
import { StopAreaPopup } from './StopAreaPopup';

type EditStopAreaLayerProps = {
  readonly editedArea: StopAreaMinimalShowOnMapFieldsFragment;
  readonly onPopupClose: () => void;
};

export const EditStopAreaLayer = ({
  editedArea,
  onPopupClose,
}: EditStopAreaLayerProps) => {
  return <StopAreaPopup area={editedArea} onClose={onPopupClose} />;
};
