export class MeasurementsViewCard {
  getContainer = () => cy.getByTestId('MeasurementsViewCard::container');

  getStopType = () => cy.getByTestId('MeasurementsViewCard::stopType');

  getCurvedStop = () => cy.getByTestId('MeasurementsViewCard::curvedStop');

  getShelterType = () => cy.getByTestId('MeasurementsViewCard::shelterType');

  getShelterLaneDistance = () =>
    cy.getByTestId('MeasurementsViewCard::shelterLaneDistance');

  getCurbBackOfRailDistance = () =>
    cy.getByTestId('MeasurementsViewCard::curbBackOfRailDistance');

  getStopAreaSideSlope = () =>
    cy.getByTestId('MeasurementsViewCard::stopAreaSideSlope');

  getStopAreaLengthwiseSlope = () =>
    cy.getByTestId('MeasurementsViewCard::stopAreaLengthwiseSlope');

  getStructureLaneDistance = () =>
    cy.getByTestId('MeasurementsViewCard::structureLaneDistance');

  getStopElevationFromRailTop = () =>
    cy.getByTestId('MeasurementsViewCard::stopElevationFromRailTop');

  getStopElevationFromSidewalk = () =>
    cy.getByTestId('MeasurementsViewCard::stopElevationFromSidewalk');

  getLowerCleatHeight = () =>
    cy.getByTestId('MeasurementsViewCard::lowerCleatHeight');

  getPlatformEdgeWarningArea = () =>
    cy.getByTestId('MeasurementsViewCard::platformEdgeWarningArea');

  getSidewalkAccessibleConnection = () =>
    cy.getByTestId('MeasurementsViewCard::sidewalkAccessibleConnection');

  getGuidanceStripe = () =>
    cy.getByTestId('MeasurementsViewCard::guidanceStripe');

  getServiceAreaStripes = () =>
    cy.getByTestId('MeasurementsViewCard::serviceAreaStripes');

  getGuidanceType = () => cy.getByTestId('MeasurementsViewCard::guidanceType');

  getGuidanceTiles = () =>
    cy.getByTestId('MeasurementsViewCard::guidanceTiles');

  getMapType = () => cy.getByTestId('MeasurementsViewCard::mapType');

  getCurbDriveSideOfRailDistance = () =>
    cy.getByTestId('MeasurementsViewCard::curbDriveSideOfRailDistance');

  getEndRampSlope = () => cy.getByTestId('MeasurementsViewCard::endRampSlope');

  getServiceAreaWidth = () =>
    cy.getByTestId('MeasurementsViewCard::serviceAreaWidth');

  getServiceAreaLength = () =>
    cy.getByTestId('MeasurementsViewCard::serviceAreaLength');

  getPedestrianCrossingRampType = () =>
    cy.getByTestId('MeasurementsViewCard::pedestrianCrossingRampType');

  getStopAreaSurroundingsAccessible = () =>
    cy.getByTestId('MeasurementsViewCard::stopAreaSurroundingsAccessible');
}
