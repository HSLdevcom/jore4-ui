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
          <div data-testid={testIds.name}>{maintainer.name ?? ''}</div>
          <div data-testid={testIds.phone}>
            {maintainer.privateContactDetails?.phone ?? ''}
          </div>
          <div data-testid={testIds.email}>
            {maintainer.privateContactDetails?.email ?? ''}
          </div>
        </>
      ) : (
        <div>-</div>
      )}
    </div>
  );
};
