import { gql } from '@apollo/client';
import flow from 'lodash/flow';
import { useTranslation } from 'react-i18next';
import {
  CreatedTimingPlaceFragment,
  InsertTimingPlaceMutationVariables,
  NewTimingPlaceFragment,
  TimingPatternTimingPlaceInsertInput,
  useGetTimingPlacesByLabelAsyncQuery,
  useInsertTimingPlaceMutation,
} from '../../generated/graphql';
import { showDangerToast } from '../../utils';

interface CreateParams {
  input: NewTimingPlaceFragment;
}

interface CreateChanges {
  timingPlaceToCreate: TimingPatternTimingPlaceInsertInput;
  conflicts?: CreatedTimingPlaceFragment[];
}

const GQL_NEW_TIMING_PLACE = gql`
  fragment new_timing_place on timing_pattern_timing_place {
    label
    description
  }
`;

const GQL_CREATED_TIMING_PLACE = gql`
  fragment created_timing_place on timing_pattern_timing_place {
    timing_place_id
    label
    description
  }
`;

const GQL_INSERT_TIMING_PLACE = gql`
  mutation InsertTimingPlace(
    $object: timing_pattern_timing_place_insert_input!
  ) {
    insert_timing_pattern_timing_place_one(object: $object) {
      ...created_timing_place
    }
  }
`;

const GQL_GET_TIMING_PLACES_BY_LABEL = gql`
  query GetTimingPlacesByLabel($label: String!) {
    timing_pattern_timing_place(where: { label: { _eq: $label } }) {
      ...created_timing_place
    }
  }
`;

export const useCreateTimingPlace = () => {
  const { t } = useTranslation();

  const [mutateFunction] = useInsertTimingPlaceMutation();
  const [getTimingPlacesByLabel] = useGetTimingPlacesByLabelAsyncQuery();

  const insertTimingPlaceMutation = async (
    variables: InsertTimingPlaceMutationVariables,
  ) =>
    mutateFunction({
      variables,
    });

  const getConflictingTimingPlaces = async (label: string) => {
    const existingTimingPlacesResult = await getTimingPlacesByLabel({
      label,
    });

    const existingTimingPlaces =
      existingTimingPlacesResult.data.timing_pattern_timing_place;

    return existingTimingPlaces;
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareCreate = async ({ input }: CreateParams) => {
    const conflicts = await getConflictingTimingPlaces(input.label);

    const timingPlaceToCreate: TimingPatternTimingPlaceInsertInput = input;

    const changes: CreateChanges = {
      timingPlaceToCreate,
      conflicts,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (changes: CreateChanges) => {
    const variables: InsertTimingPlaceMutationVariables = {
      object: changes.timingPlaceToCreate,
    };
    return variables;
  };

  const prepareAndExecute = flow(
    prepareCreate,
    mapCreateChangesToVariables,
    insertTimingPlaceMutation,
  );

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertTimingPlaceMutation,
    prepareAndExecute,
    defaultErrorHandler,
  };
};
