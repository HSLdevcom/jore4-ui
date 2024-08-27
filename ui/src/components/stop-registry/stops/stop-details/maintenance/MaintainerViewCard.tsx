import { StopPlaceOrganisationFieldsFragment } from '../../../../../generated/graphql';

const testIds = {
  name: `MaintainerViewCard::name`,
  phone: `MaintainerViewCard::phone`,
  email: `MaintainerViewCard::email`,
  notSelectedPlaceholder: `MaintainerViewCard::notSelectedPlaceholder`,
};

interface Props {
  testId: string;
  title: string;
  maintainer: StopPlaceOrganisationFieldsFragment | null;
}

export const MaintainerViewCard = ({
  testId,
  title,
  maintainer,
}: Props): React.ReactElement => {
  return (
    <div data-testid={testId} className="text-sm">
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
        <div data-testid={testIds.notSelectedPlaceholder}>-</div>
      )}
    </div>
  );
};
