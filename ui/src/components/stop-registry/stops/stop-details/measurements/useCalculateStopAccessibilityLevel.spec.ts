import { renderHook } from '@testing-library/react';
import {
  StopRegistryAccessibilityLevel as StopAccessibilityLevel,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';
import {
  HslAccessibilityLevelCalculationProperties,
  ShelterAccessibilityLevelCalculationProperties,
  StopAccessibilityLevelCalculationProperties,
  useCalculateStopAccessibilityLevel,
} from './useCalculateStopAccessibilityLevel';

describe('calculateStopAccessibilityLevel', () => {
  // Helps readability if we can use helper functions and have most tests as oneliners.
  /* eslint-disable jest/expect-expect */
  const calculateAccessibilityLevel = (
    stop: StopAccessibilityLevelCalculationProperties,
  ) => {
    const { result } = renderHook(() => useCalculateStopAccessibilityLevel());

    const accessibilityLevel =
      result.current.calculateStopAccessibilityLevel(stop);

    return accessibilityLevel;
  };

  const fullyAccessibleMeasurements: HslAccessibilityLevelCalculationProperties =
    {
      serviceAreaWidth: 175,
      stopElevationFromRailTop: 27,
      stopElevationFromSidewalk: 20,
      stopAreaLengthwiseSlope: 2.5,
      stopAreaSideSlope: 1,
      stopAreaSurroundingsAccessible: true,
      platformEdgeWarningArea: true,
    };

  const fullyAccessibleShelterEquipment: ShelterAccessibilityLevelCalculationProperties =
    {
      shelterType: StopRegistryShelterType.Steel,
      shelterLighting: true,
    };

  const createStop = (
    hslAccessibilityProps: HslAccessibilityLevelCalculationProperties,
    shelterEquipment: ShelterAccessibilityLevelCalculationProperties,
  ): StopAccessibilityLevelCalculationProperties => {
    return {
      accessibilityAssessment: {
        hslAccessibilityProperties: hslAccessibilityProps,
      },
      quays: [
        {
          placeEquipments: {
            shelterEquipment: [shelterEquipment],
          },
        },
      ],
    };
  };

  describe('serviceAreaWidth', () => {
    const testServiceWidth = (
      serviceAreaWidth: (typeof fullyAccessibleMeasurements)['serviceAreaWidth'],
      expectedLevel: StopAccessibilityLevel,
    ) => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          serviceAreaWidth,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(expectedLevel);
    };

    it('returns FullyAccessible when width is over 1.5 m', () => {
      testServiceWidth(1.51, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when width is exactly 1.5 m', () => {
      testServiceWidth(1.5, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns PartiallyInaccessible when width is between 1.5 m - 1.2 m', () => {
      testServiceWidth(1.49, StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns PartiallyInaccessible when width is exactly 1.2 m', () => {
      testServiceWidth(1.2, StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Inaccessible when width is under 1.2 m', () => {
      testServiceWidth(1.19, StopAccessibilityLevel.Inaccessible);
    });

    it('returns Unknown when width is not set', () => {
      testServiceWidth(null, StopAccessibilityLevel.Unknown);
      testServiceWidth(undefined, StopAccessibilityLevel.Unknown);
    });
  });

  describe('stopElevationFromSidewalk for buses', () => {
    const testServiceElevation = (
      stopElevationFromSidewalk: (typeof fullyAccessibleMeasurements)['stopElevationFromSidewalk'],
      expectedLevel: StopAccessibilityLevel,
    ) => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          stopElevationFromSidewalk,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(expectedLevel);
    };

    it('returns Inaccessible when elevation is over 25 cm', () => {
      testServiceElevation(25.5, StopAccessibilityLevel.Inaccessible);
    });

    it('returns FullyAccessible when elevation is exactly 25 cm', () => {
      testServiceElevation(25, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when elevation is between 16 cm - 25 cm', () => {
      testServiceElevation(24.9, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when elevation is exactly 16 cm', () => {
      testServiceElevation(16, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns PartiallyInaccessible when elevation is between 12 cm - 16 cm', () => {
      testServiceElevation(15.9, StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns PartiallyInaccessible when elevation is exactly 12 cm', () => {
      testServiceElevation(12, StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Inaccessible when elevation is under 12 cm', () => {
      testServiceElevation(11.9, StopAccessibilityLevel.Inaccessible);
    });

    it('returns Unknown when elevation is not set', () => {
      testServiceElevation(null, StopAccessibilityLevel.Unknown);
      testServiceElevation(undefined, StopAccessibilityLevel.Unknown);
    });
  });

  describe('stopAreaLengthwiseSlope', () => {
    const testServiceLengthwiseSlope = (
      stopAreaLengthwiseSlope: (typeof fullyAccessibleMeasurements)['stopAreaLengthwiseSlope'],
      expectedLevel: StopAccessibilityLevel,
    ) => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          stopAreaLengthwiseSlope,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(expectedLevel);
    };

    it('returns FullyAccessible when stopAreaLengthwiseSlope is 0 %', () => {
      testServiceLengthwiseSlope(0, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when stopAreaLengthwiseSlope is under 3 %', () => {
      testServiceLengthwiseSlope(2.99, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when stopAreaLengthwiseSlope is exactly 3 %', () => {
      testServiceLengthwiseSlope(3, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns MostlyAccessible when stopAreaLengthwiseSlope is under 5 %', () => {
      testServiceLengthwiseSlope(3.01, StopAccessibilityLevel.MostlyAccessible);
    });

    it('returns MostlyAccessible when stopAreaLengthwiseSlope is exactly 5 %', () => {
      testServiceLengthwiseSlope(5, StopAccessibilityLevel.MostlyAccessible);
    });

    it('returns PartiallyInaccessible when stopAreaLengthwiseSlope is under 8 %', () => {
      testServiceLengthwiseSlope(
        5.01,
        StopAccessibilityLevel.PartiallyInaccessible,
      );
    });

    it('returns PartiallyInaccessible when stopAreaLengthwiseSlope is exactly 8 %', () => {
      testServiceLengthwiseSlope(
        8,
        StopAccessibilityLevel.PartiallyInaccessible,
      );
    });

    it('returns Inaccessible when stopAreaLengthwiseSlope is over 8 %', () => {
      testServiceLengthwiseSlope(8.01, StopAccessibilityLevel.Inaccessible);
    });

    it('returns Unknown when stopAreaLengthwiseSlope is not set', () => {
      testServiceLengthwiseSlope(null, StopAccessibilityLevel.Unknown);
      testServiceLengthwiseSlope(undefined, StopAccessibilityLevel.Unknown);
    });
  });

  describe('stopAreaSideSlope', () => {
    const testServiceSideSlope = (
      stopAreaSideSlope: (typeof fullyAccessibleMeasurements)['stopAreaSideSlope'],
      expectedLevel: StopAccessibilityLevel,
    ) => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          stopAreaSideSlope,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(expectedLevel);
    };

    it('returns FullyAccessible when stopAreaSideSlope is 0 %', () => {
      testServiceSideSlope(0, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when stopAreaSideSlope is under 2 %', () => {
      testServiceSideSlope(1.99, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns FullyAccessible when stopAreaSideSlope is exactly 2 %', () => {
      testServiceSideSlope(2, StopAccessibilityLevel.FullyAccessible);
    });

    it('returns MostlyAccessible when stopAreaSideSlope is under 3 %', () => {
      testServiceSideSlope(2.01, StopAccessibilityLevel.MostlyAccessible);
    });

    it('returns MostlyAccessible when stopAreaSideSlope is exactly 3 %', () => {
      testServiceSideSlope(3, StopAccessibilityLevel.MostlyAccessible);
    });

    it('returns PartiallyInaccessible when stopAreaSideSlope is under 5 %', () => {
      testServiceSideSlope(3.01, StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns PartiallyInaccessible when stopAreaSideSlope is exactly 5 %', () => {
      testServiceSideSlope(5, StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Inaccessible when stopAreaSideSlope is over 5 %', () => {
      testServiceSideSlope(5.01, StopAccessibilityLevel.Inaccessible);
    });

    it('returns Unknown when stopAreaSideSlope is not set', () => {
      testServiceSideSlope(null, StopAccessibilityLevel.Unknown);
      testServiceSideSlope(undefined, StopAccessibilityLevel.Unknown);
    });
  });

  describe('accessibility properties', () => {
    it('returns FullyAccessible if all required accessibility properties are acceptable and other measurements are within limits', () => {
      const stop = createStop(
        fullyAccessibleMeasurements,
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.FullyAccessible);
    });

    it('downgrades to PartiallyInaccessible if stopAreaSurroundingsAccessible is false', () => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          stopAreaSurroundingsAccessible: false,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Unknown if stopAreaSurroundingsAccessible is not set', () => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          stopAreaSurroundingsAccessible: null,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.Unknown);
    });

    it('downgrades to PartiallyInaccessible if platformEdgeWarningArea is false', () => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          platformEdgeWarningArea: false,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Unknown if platformEdgeWarningArea is not set', () => {
      const stop = createStop(
        {
          ...fullyAccessibleMeasurements,
          platformEdgeWarningArea: null,
        },
        fullyAccessibleShelterEquipment,
      );

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.Unknown);
    });

    it('downgrades to PartiallyInaccessible if shelterLighting is false', () => {
      const stop = createStop(fullyAccessibleMeasurements, {
        ...fullyAccessibleShelterEquipment,
        shelterLighting: false,
      });

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Unknown if shelterLighting is not set', () => {
      const stop = createStop(fullyAccessibleMeasurements, {
        ...fullyAccessibleShelterEquipment,
        shelterLighting: null,
      });

      const level = calculateAccessibilityLevel(stop);

      expect(level).toEqual(StopAccessibilityLevel.Unknown);
    });

    describe('shelterType', () => {
      const testShelterType = (
        shelterType: StopRegistryShelterType | null | undefined,
        expectedLevel: StopAccessibilityLevel,
      ) => {
        const stop = createStop(fullyAccessibleMeasurements, {
          ...fullyAccessibleShelterEquipment,
          shelterType,
        });

        const level = calculateAccessibilityLevel(stop);

        expect(level).toEqual(expectedLevel);
      };

      it('returns FullyAccessible for accessible shelter types', () => {
        const expectedLevel = StopAccessibilityLevel.FullyAccessible;

        testShelterType(StopRegistryShelterType.Concrete, expectedLevel);
        testShelterType(StopRegistryShelterType.Glass, expectedLevel);
        testShelterType(StopRegistryShelterType.Steel, expectedLevel);
        testShelterType(StopRegistryShelterType.Urban, expectedLevel);
        testShelterType(StopRegistryShelterType.Wooden, expectedLevel);
      });

      it('downgrades to PartiallyInaccessible for inaccessible shelter types', () => {
        const expectedLevel = StopAccessibilityLevel.PartiallyInaccessible;

        testShelterType(StopRegistryShelterType.Post, expectedLevel);
        testShelterType(StopRegistryShelterType.Virtual, expectedLevel);
      });

      it('returns Unknown when shelter type is not set', () => {
        testShelterType(null, StopAccessibilityLevel.Unknown);
        testShelterType(undefined, StopAccessibilityLevel.Unknown);
      });

      it('returns Unknown when stop has no shelter', () => {
        const stop = createStop(fullyAccessibleMeasurements, null);

        const level = calculateAccessibilityLevel(stop);

        expect(level).toEqual(StopAccessibilityLevel.Unknown);
      });
    });
  });

  describe('level limits', () => {
    it('returns FullyAccessible when all properties are exactly at their limit', () => {
      const stop = createStop(
        {
          serviceAreaWidth: 150,
          stopElevationFromRailTop: null, // Does not affect because bus.
          stopElevationFromSidewalk: 16,
          stopAreaLengthwiseSlope: 3,
          stopAreaSideSlope: 2,
          stopAreaSurroundingsAccessible: true,
          platformEdgeWarningArea: true,
        },
        {
          shelterType: StopRegistryShelterType.Steel,
          shelterLighting: true,
        },
      );
      const level = calculateAccessibilityLevel(stop);
      expect(level).toEqual(StopAccessibilityLevel.FullyAccessible);
    });

    it('returns MostlyAccessible when all properties are just outside FullyAccessible limit', () => {
      const stop = createStop(
        {
          serviceAreaWidth: 150,
          stopElevationFromRailTop: null, // Does not affect because bus.
          stopElevationFromSidewalk: 16,
          stopAreaLengthwiseSlope: 3.01,
          stopAreaSideSlope: 2.01,
          stopAreaSurroundingsAccessible: true,
          platformEdgeWarningArea: true,
        },
        {
          shelterType: StopRegistryShelterType.Steel,
          shelterLighting: true,
        },
      );
      const level = calculateAccessibilityLevel(stop);
      expect(level).toEqual(StopAccessibilityLevel.MostlyAccessible);
    });

    it('returns MostlyAccessible when all properties are exactly at their limit', () => {
      const stop = createStop(
        {
          serviceAreaWidth: 150,
          stopElevationFromRailTop: null, // Does not affect because bus.
          stopElevationFromSidewalk: 16,
          stopAreaLengthwiseSlope: 5,
          stopAreaSideSlope: 3,
          stopAreaSurroundingsAccessible: true,
          platformEdgeWarningArea: true,
        },
        {
          shelterType: StopRegistryShelterType.Steel,
          shelterLighting: true,
        },
      );
      const level = calculateAccessibilityLevel(stop);
      expect(level).toEqual(StopAccessibilityLevel.MostlyAccessible);
    });

    it('returns PartiallyInaccessible when all properties are just outside MostlyAccessible limit', () => {
      const stop = createStop(
        {
          serviceAreaWidth: 149.99,
          stopElevationFromRailTop: null, // Does not affect because bus.
          stopElevationFromSidewalk: 15.99,
          stopAreaLengthwiseSlope: 5.01,
          stopAreaSideSlope: 3.01,
          stopAreaSurroundingsAccessible: true,
          platformEdgeWarningArea: true,
        },
        {
          shelterType: StopRegistryShelterType.Steel,
          shelterLighting: true,
        },
      );
      const level = calculateAccessibilityLevel(stop);
      expect(level).toEqual(StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns PartiallyInaccessible when all properties are exactly at its lower limit', () => {
      const stop = createStop(
        {
          serviceAreaWidth: 120,
          stopElevationFromRailTop: null, // Does not affect because bus.
          stopElevationFromSidewalk: 12,
          stopAreaLengthwiseSlope: 8,
          stopAreaSideSlope: 5,
          stopAreaSurroundingsAccessible: false,
          platformEdgeWarningArea: false,
        },
        {
          shelterType: StopRegistryShelterType.Virtual,
          shelterLighting: false,
        },
      );
      const level = calculateAccessibilityLevel(stop);
      expect(level).toEqual(StopAccessibilityLevel.PartiallyInaccessible);
    });

    it('returns Inaccessible when all properties are just outside PartiallyInaccessible limit', () => {
      const stop = createStop(
        {
          serviceAreaWidth: 119.99,
          stopElevationFromRailTop: null, // Does not affect because bus.
          stopElevationFromSidewalk: 11.99,
          stopAreaLengthwiseSlope: 8.01,
          stopAreaSideSlope: 5.01,
          stopAreaSurroundingsAccessible: false,
          platformEdgeWarningArea: false,
        },
        {
          shelterType: StopRegistryShelterType.Virtual,
          shelterLighting: false,
        },
      );
      const level = calculateAccessibilityLevel(stop);
      expect(level).toEqual(StopAccessibilityLevel.Inaccessible);
    });
  });

  /* eslint-enable jest/expect-expect */
});
