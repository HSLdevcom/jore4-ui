import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetInfoSpotPurposesQuery } from '../../../../../../generated/graphql';
import { stringToInfoSpotPurposeEnum } from '../utils/infoSpotPurposeUtils';

const GQL_GET_INFO_SPOT_PURPOSES = gql`
  query GetInfoSpotPurposes {
    stopsDb: stops_database {
      latestInfoSpotPosters: stops_database_info_spot_poster(
        distinct_on: netex_id
        order_by: [{ netex_id: asc }, { version: desc }]
      ) {
        label
      }
    }
  }
`;

export function useGetInfoSpotPurposes() {
  const { data, loading } = useGetInfoSpotPurposesQuery();
  const { t } = useTranslation();

  const collator = useMemo(
    () => new Intl.Collator(t(($) => $.languages.intlLangCode)),
    [t],
  );

  const customPurposes = useMemo(() => {
    if (!data || loading) {
      return [];
    }

    // Collect labels from latest version of each info spot poster,
    // so that unused labels are not included in the dropdown
    const inDB = compact(
      data.stopsDb?.latestInfoSpotPosters?.map((poster) => poster.label),
    );
    const withoutEnums = inDB.filter(
      (label) => !stringToInfoSpotPurposeEnum(label),
    );

    return uniq(withoutEnums).sort(collator.compare.bind(collator));
  }, [data, loading, collator]);

  return { customPurposes, loading };
}
