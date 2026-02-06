export class MeasurementsViewCard {
  static getContainer = () => cy.getByTestId('MeasurementsViewCard::container');

  static getStopType = () => cy.getByTestId('MeasurementsViewCard::stopType');

  static getCurvedStop = () =>
    cy.getByTestId('MeasurementsViewCard::curvedStop');

  static getShelterType = () =>
    cy.getByTestId('MeasurementsViewCard::shelterType');

  static getShelterLaneDistance = () =>
    cy.getByTestId('MeasurementsViewCard::shelterLaneDistance');

  static getCurbBackOfRailDistance = () =>
    cy.getByTestId('MeasurementsViewCard::curbBackOfRailDistance');

  static getStopAreaSideSlope = () =>
    cy.getByTestId('MeasurementsViewCard::stopAreaSideSlope');

  static getStopAreaLengthwiseSlope = () =>
    cy.getByTestId('MeasurementsViewCard::stopAreaLengthwiseSlope');

  static getStructureLaneDistance = () =>
    cy.getByTestId('MeasurementsViewCard::structureLaneDistance');

  static getStopElevationFromRailTop = () =>
    cy.getByTestId('MeasurementsViewCard::stopElevationFromRailTop');

  static getStopElevationFromSidewalk = () =>
    cy.getByTestId('MeasurementsViewCard::stopElevationFromSidewalk');

  static getLowerCleatHeight = () =>
    cy.getByTestId('MeasurementsViewCard::lowerCleatHeight');

  static getPlatformEdgeWarningArea = () =>
    cy.getByTestId('MeasurementsViewCard::platformEdgeWarningArea');

  static getSidewalkAccessibleConnection = () =>
    cy.getByTestId('MeasurementsViewCard::sidewalkAccessibleConnection');

  static getGuidanceStripe = () =>
    cy.getByTestId('MeasurementsViewCard::guidanceStripe');

  static getServiceAreaStripes = () =>
    cy.getByTestId('MeasurementsViewCard::serviceAreaStripes');

  static getGuidanceType = () =>
    cy.getByTestId('MeasurementsViewCard::guidanceType');

  static getGuidanceTiles = () =>
    cy.getByTestId('MeasurementsViewCard::guidanceTiles');

  static getMapType = () => cy.getByTestId('MeasurementsViewCard::mapType');

  static getCurbDriveSideOfRailDistance = () =>
    cy.getByTestId('MeasurementsViewCard::curbDriveSideOfRailDistance');

  static getEndRampSlope = () =>
    cy.getByTestId('MeasurementsViewCard::endRampSlope');

  static getServiceAreaWidth = () =>
    cy.getByTestId('MeasurementsViewCard::serviceAreaWidth');

  static getServiceAreaLength = () =>
    cy.getByTestId('MeasurementsViewCard::serviceAreaLength');

  static getPedestrianCrossingRampType = () =>
    cy.getByTestId('MeasurementsViewCard::pedestrianCrossingRampType');

  static getStopAreaSurroundingsAccessible = () =>
    cy.getByTestId('MeasurementsViewCard::stopAreaSurroundingsAccessible');
}
