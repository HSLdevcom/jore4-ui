import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { Visible } from '../../../../../layoutComponents';
import { HorizontalSeparator } from '../layout';
import { ShelterViewCard } from './ShelterViewCard';

interface Props {
  shelters: Array<ShelterEquipmentDetailsFragment>;
}

export const SheltersViewList = ({ shelters }: Props): React.ReactElement => {
  return (
    <div>
      {shelters.map((shelter, idx) => (
        <div key={shelter.id}>
          <ShelterViewCard shelter={shelter} />
          <Visible visible={idx !== shelters.length - 1}>
            <HorizontalSeparator className="my-4" />
          </Visible>
        </div>
      ))}
    </div>
  );
};
