import { ApolloQueryResult } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  InsertStopMutationVariables,
  QueryClosestLinkDocument,
  QueryClosestLinkQueryResult,
  QueryClosestLinkQueryVariables,
  QueryPointDirectionOnLinkDocument,
  QueryPointDirectionOnLinkQueryResult,
  QueryPointDirectionOnLinkQueryVariables,
  useInsertStopMutation,
} from '../../generated/graphql';
import { useAsyncQuery } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { Direction } from '../../types';
import {
  mapPointToPointGeography,
  mapToObject,
  mapToVariables,
} from '../../utils';

const parseInfraLinkId = (
  response: ApolloQueryResult<QueryClosestLinkQueryResult>,
) => {
  return (
    // @ts-expect-error types seems to be off
    response.data?.infrastructure_network_resolve_point_to_closest_link?.[0]
      ?.infrastructure_link_id
  );
};

const parseStopDirection = (
  response: ApolloQueryResult<QueryPointDirectionOnLinkQueryResult>,
) => {
  // @ts-expect-error types seems to be off
  return response.data?.infrastructure_network_find_point_direction_on_link?.[0]
    ?.value;
};

const schema = z.object({
  finnishName: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmitSuccess: () => void;
}

const StopFormComponent = (
  { className, defaultValues, onSubmitSuccess }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [fetchClosestLink] = useAsyncQuery<
    QueryClosestLinkQueryResult,
    QueryClosestLinkQueryVariables
  >(QueryClosestLinkDocument);
  const [fetchStopDirection] = useAsyncQuery<
    QueryPointDirectionOnLinkQueryResult,
    QueryPointDirectionOnLinkQueryVariables
  >(QueryPointDirectionOnLinkDocument);
  const [mutateFunction] = useInsertStopMutation();

  const onSubmit = async (state: FormState) => {
    const point = mapPointToPointGeography({
      latitude: state.latitude,
      longitude: state.longitude,
    });
    const closestLinkResponse = await fetchClosestLink({ point });
    const closestLinkId = parseInfraLinkId(closestLinkResponse);
    const stopDirectionResponse = await fetchStopDirection({
      point_of_interest: point,
      infrastructure_link_uuid: closestLinkId,
      point_max_distance_in_meters: 50,
    });
    const direction = parseStopDirection(stopDirectionResponse);

    if (!direction) {
      // eslint-disable-next-line no-console
      console.warn(
        `Could not resolve stop direction. TODO: implement ui for entering it manually. Fallbacking to "${Direction.Forward}" for now.`,
      );
    }

    const variables: InsertStopMutationVariables = mapToObject({
      located_on_infrastructure_link_id: closestLinkId,
      // TODO: Getting link direction is not always possible. In those cases we should let user input direction manually. Use hardcoded value for now.
      direction: direction || Direction.Forward,
      measured_location: point,
      // TODO: how we should calculate label? Use finnishName as label for now as
      // have been done in jore3 importer, but it won't be correct solution in the long
      // term.
      label: state.finnishName,
      priority: 10,
    });

    try {
      await mutateFunction(mapToVariables(variables));
      onSubmitSuccess();
      // eslint-disable-next-line no-console
      console.log('Stop created succesfully. TODO: inform user about it');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`Err, ${err}, TODO: show error message}`);
    }
  };

  return (
    <form
      className={className || ''}
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
    >
      <h2 className="pb-6 text-xl font-bold">{t('stops.stop')}</h2>
      <Row className="space-x-10">
        <Column className="space-y-2">
          <h3 className="text-lg font-bold">{t('stops.nameAddress')}</h3>
          <Column>
            <label htmlFor="finnishName">{t('stops.finnishName')}</label>
            <input type="text" {...register('finnishName', {})} />
            <p>
              {errors.finnishName?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
        </Column>
        <Column className="space-y-2">
          <h3 className="text-lg font-bold">{t('map.location')}</h3>
          <Row className="space-x-5">
            <Column>
              <label htmlFor="latitude">{t('map.latitude')}</label>
              <input
                type="number"
                {...register('latitude', {
                  valueAsNumber: true,
                })}
                step="any"
              />
              <p>{errors.latitude?.message}</p>
            </Column>
            <Column>
              <label htmlFor="longitude">{t('map.longitude')}</label>
              <input
                type="number"
                {...register('longitude', {
                  valueAsNumber: true,
                })}
                step="any"
              />
              <p>{errors.longitude?.message}</p>
            </Column>
          </Row>
        </Column>
      </Row>
    </form>
  );
};

export const StopForm = React.forwardRef(StopFormComponent);
