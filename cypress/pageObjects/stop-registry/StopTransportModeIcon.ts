import { StopRegistryTransportModeType } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

const knownModes = Object.values(StopRegistryTransportModeType).sort();

type ExtendedTransportMode =
  | StopRegistryTransportModeType
  | 'TrunkLine'
  | 'SpeedTram';

type ModesByStatus = {
  readonly inUse?: ReadonlyArray<ExtendedTransportMode>;
  readonly outOfUse?: ReadonlyArray<ExtendedTransportMode>;
};

function extendedToBaseMode(
  extendedMode: ExtendedTransportMode,
): StopRegistryTransportModeType {
  if (extendedMode === 'TrunkLine') {
    return StopRegistryTransportModeType.Bus;
  }

  if (extendedMode === 'SpeedTram') {
    return StopRegistryTransportModeType.Tram;
  }

  return extendedMode;
}

export class StopTransportModeIcon {
  static getUnknown() {
    return cy.getByTestId('StopTransportModeIcon::unknown');
  }

  static getIcons() {
    return cy.getByTestId('StopTransportModeIcon::icon');
  }

  static getByTransportMode(mode: StopRegistryTransportModeType) {
    return StopTransportModeIcon.getIcons().filter(
      `[data-transport-mode="${mode}"]`,
    );
  }

  static assertTransportModeIcons({
    inUse = [],
    outOfUse = [],
  }: ModesByStatus) {
    StopTransportModeIcon.getUnknown().should('not.exist');

    const listedModes = inUse.concat(outOfUse);
    const listedBaseModes = listedModes.map(extendedToBaseMode);
    const baseModesInUse = inUse.map(extendedToBaseMode);

    knownModes.forEach((mode) => {
      if (!listedBaseModes.includes(mode)) {
        StopTransportModeIcon.getByTransportMode(mode).should('not.exist');
      } else {
        StopTransportModeIcon.getByTransportMode(mode)
          .shouldBeVisible()
          .and(
            'have.attr',
            'data-active',
            baseModesInUse.includes(mode).toString(),
          )
          .and(
            'have.attr',
            'data-trunk-line',
            (
              mode === StopRegistryTransportModeType.Bus &&
              listedModes.includes('TrunkLine')
            ).toString(),
          )
          .and(
            'have.attr',
            'data-speed-tram',
            (
              mode === StopRegistryTransportModeType.Tram &&
              listedModes.includes('SpeedTram')
            ).toString(),
          );
      }
    });
  }
}
