import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { ShelterViewCard } from './ShelterViewCard';

interface Props {
  shelters: ReadonlyArray<ShelterEquipmentDetailsFragment>;
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
