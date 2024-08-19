import { StopPlaceOrganisationFieldsFragment } from '../../../../../generated/graphql';

const testIds = {
  name: `MaintainerViewCard::name`,
  phone: `MaintainerViewCard::phone`,
  email: `MaintainerViewCard::email`,
};

interface Props {
  title: string;
  maintainer: StopPlaceOrganisationFieldsFragment | null;
}

export const MaintainerViewCard = ({
  title,
  maintainer,
}: Props): React.ReactElement => {
  return (
    <div className="text-sm">
      <h5 className="leading-8">{title}</h5>
      {maintainer ? (
        <>
          <p data-testid={testIds.name}>{maintainer?.name ?? ''}</p>
          <p data-testid={testIds.phone}>
            {maintainer?.privateContactDetails?.phone ?? ''}
          </p>
          <p data-testid={testIds.email}>
            {maintainer?.privateContactDetails?.email ?? ''}
          </p>
        </>
      ) : (
        <p>-</p>
      )}
    </div>
  );
};
