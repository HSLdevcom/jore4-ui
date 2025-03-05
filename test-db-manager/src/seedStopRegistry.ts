import groupBy from 'lodash/groupBy';
import {
  buildTerminalCreateInput,
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
  const collectedOrganisationIds = await insertOrganisations(seedOrganisations);

  const stopPlacesWithOrganisations = seedStopAreas.map((sa) =>
    setStopPlaceOrganisations(sa, collectedOrganisationIds),
  );

  const stopAreas = groupBy(
    seedQuays.filter((sq) => !!sq.stopArea),
    (quay) => quay.stopArea,
  );

  const stopPlaceInputsWithStopAreas: Array<
    Partial<StopRegistryStopPlaceInput>
  > = Object.entries(stopAreas).map(([privateCode, quays]) => {
    return {
      ...stopPlacesWithOrganisations.find(
        (sp) => sp.privateCode?.value === privateCode,
      ),
      quays: quays.map((quay) => quay.quay),
    };
  });

  const stopPlaceInputs: Array<Partial<StopRegistryStopPlaceInput>> = seedQuays
    .filter((quay) => !quay.stopArea)
    .map((quay) => {
      return {
        name: {
          value: stopNames[quay.quay.publicCode ?? '']?.name ?? '',
          lang: 'fin',
        },
        alternativeNames: [
          {
            nameType: StopRegistryNameType.Translation,
            name: {
              value: stopNames[quay.quay.publicCode ?? '']?.nameSwe ?? '',
              lang: 'swe',
            },
          },
        ],
        transportMode: StopRegistryTransportModeType.Bus,
        privateCode: { value: quay.quay.publicCode ?? 'missingName' },
        geometry: quay.quay.geometry,
        quays: [quay.quay],
      };
    });

  const { collectedStopIds, collectedQuayDetails } = await insertStopPlaces([
    ...stopPlaceInputs,
    ...stopPlaceInputsWithStopAreas,
  ]);

  const terminalCreateInputs = seedTerminals.map((terminal) =>
    buildTerminalCreateInput(terminal, collectedStopIds),
  );
  const terminalUpdateInputs = seedTerminals.map(
    (terminal) => terminal.terminal,
  );
  await insertTerminals(terminalCreateInputs, terminalUpdateInputs);

  const infoSpotInputs = seedInfoSpots.map((infoSpot) =>
    setInfoSpotRelations(infoSpot, collectedQuayDetails),
  );

  await insertInfoSpots(infoSpotInputs);
};

seedStopRegistry();
