import groupBy from 'lodash/groupBy';
import {
  buildTerminalCreateInput,
  buildTerminalUpdateInput,
  mapTerminalOwnersToOrganisations,
  seedInfoSpots,
  seedOrganisations,
  seedQuays,
  seedStopAreas,
  seedTerminals,
  setInfoSpotRelations,
  setStopPlaceOrganisations,
  stopNames,
} from './datasets';
import {
  StopRegistryNameType,
  StopRegistryStopPlaceInput,
  StopRegistryTransportModeType,
} from './generated/graphql';
import {
  insertInfoSpots,
  insertOrganisations,
  insertStopPlaces,
  insertTerminals,
} from './graphql-helpers';

const seedStopRegistry = async () => {
  const collectedOrganisationIds = await insertOrganisations(
    seedOrganisations.concat(mapTerminalOwnersToOrganisations(seedTerminals)),
  );

  const stopPlacesWithOrganisations = seedStopAreas.map((sa) =>
    setStopPlaceOrganisations(sa, collectedOrganisationIds),
  );

  const quaysByDeclaredStopArea = groupBy(
    seedQuays.filter((sq) => !!sq.stopArea),
    (quay) => quay.stopArea,
  );

  const stopPlaceInputsWithStopAreas: Array<
    Partial<StopRegistryStopPlaceInput>
  > = Object.entries(quaysByDeclaredStopArea).map(([privateCode, quays]) => {
    return {
      ...stopPlacesWithOrganisations.find(
        (sp) => sp.privateCode?.value === privateCode,
      ),
      quays: quays.map((quay) => quay.quay),
    };
  });

  const quaysByName = groupBy(
    seedQuays.filter((quay) => !quay.stopArea),
    (quay) => stopNames[quay.quay.publicCode ?? '']?.name ?? '',
  );

  const stopPlaceInputs: Array<Partial<StopRegistryStopPlaceInput>> =
    Object.entries(quaysByName).map(([name, quays]) => {
      const firstQuay = quays[0].quay;
      const publicCode = firstQuay.publicCode ?? '';
      return {
        name: { value: name, lang: 'fin' },
        alternativeNames: [
          {
            nameType: StopRegistryNameType.Translation,
            name: {
              value: stopNames[publicCode]?.nameSwe ?? '',
              lang: 'swe',
            },
          },
        ],
        transportMode: StopRegistryTransportModeType.Bus,
        privateCode: { type: 'HSL/TEST', value: publicCode },
        geometry: firstQuay.geometry,
        quays: quays.map((it) => it.quay),
      };
    });

  const { collectedStopIds, collectedQuayDetails } = await insertStopPlaces(
    [...stopPlaceInputs, ...stopPlaceInputsWithStopAreas],
    true,
  );

  const terminalCreateInputs = seedTerminals.map((terminal) =>
    buildTerminalCreateInput(terminal, collectedStopIds),
  );
  const terminalUpdateInputs = seedTerminals.map((terminal) =>
    buildTerminalUpdateInput(terminal, collectedOrganisationIds),
  );
  await insertTerminals(terminalCreateInputs, terminalUpdateInputs);

  const infoSpotInputs = seedInfoSpots.map((infoSpot) =>
    setInfoSpotRelations(infoSpot, collectedQuayDetails),
  );

  await insertInfoSpots(infoSpotInputs);
};

seedStopRegistry();
