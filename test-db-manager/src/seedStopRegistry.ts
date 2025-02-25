import {
  QuayInput,
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

  const stopAreas: Record<string, Array<QuayInput>> = {};
  seedQuays
    .filter((sq) => !!sq.stopArea)
    .forEach((quay) => {
      if (quay.stopArea) {
        if (!Object.hasOwn(stopAreas, quay.stopArea)) {
          stopAreas[quay.stopArea] = new Array<QuayInput>();
        }
        stopAreas[quay.stopArea].push(quay);
      }
    });

  const stopPlaceInputsWithStopAreas: Array<
    Partial<StopRegistryStopPlaceInput>
  > = Object.entries(stopAreas).map((stopArea) => {
    return {
      ...stopPlacesWithOrganisations.find(
        (sp) => sp.privateCode?.value === stopArea[0],
      ),
      quays: stopArea[1].map((quay) => quay.quay),
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
