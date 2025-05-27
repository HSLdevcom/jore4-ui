import { FC } from 'react';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../generated/graphql';

const testIds = {
  name: `MaintainerViewCard::name`,
  phone: `MaintainerViewCard::phone`,
  email: `MaintainerViewCard::email`,
  notSelectedPlaceholder: `MaintainerViewCard::notSelectedPlaceholder`,
};

type MaintainerViewCardProps = {
  readonly testId: string;
  readonly title: string;
  readonly maintainer: StopPlaceOrganisationFieldsFragment | null;
};

export const MaintainerViewCard: FC<MaintainerViewCardProps> = ({
  testId,
  title,
  maintainer,
}) => {
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
