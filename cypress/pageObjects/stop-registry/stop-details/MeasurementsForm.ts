export class MeasurementsForm {
  static getStopTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::stopType::ListboxButton');

  static getStopTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::stopType::ListboxOptions');

  static getCurvedStopDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::curvedStop::ListboxButton');

  static getCurvedStopDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::curvedStop::ListboxOptions');

  static getShelterTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::shelterType::ListboxButton');

  static getShelterTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::shelterType::ListboxOptions');

  static getShelterLaneDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::shelterLaneDistance');

  static getCurbBackOfRailDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::curbBackOfRailDistance');

  static getStopAreaSideSlopeInput = () =>
    cy.getByTestId('MeasurementsForm::stopAreaSideSlope');

  static getStopAreaLengthwiseSlopeInput = () =>
    cy.getByTestId('MeasurementsForm::stopAreaLengthwiseSlope');

  static getStructureLaneDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::structureLaneDistance');

  static getStopElevationFromRailTopInput = () =>
    cy.getByTestId('MeasurementsForm::stopElevationFromRailTop');

  static getStopElevationFromSidewalkInput = () =>
    cy.getByTestId('MeasurementsForm::stopElevationFromSidewalk');

  static getLowerCleatHeightInput = () =>
    cy.getByTestId('MeasurementsForm::lowerCleatHeight');

  static getPlatformEdgeWarningAreaCheckbox = () =>
    cy.getByTestId('MeasurementsForm::platformEdgeWarningArea');

  static getSidewalkAccessibleConnectionCheckbox = () =>
    cy.getByTestId('MeasurementsForm::sidewalkAccessibleConnection');

  static getGuidanceStripeCheckbox = () =>
    cy.getByTestId('MeasurementsForm::guidanceStripe');

  static getServiceAreaStripesCheckbox = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaStripes');

  static getGuidanceTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::guidanceType::ListboxButton');

  static getGuidanceTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::guidanceType::ListboxOptions');

  static getGuidanceTilesCheckbox = () =>
    cy.getByTestId('MeasurementsForm::guidanceTiles');

  static getMapTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::mapType::ListboxButton');

  static getMapTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::mapType::ListboxOptions');

  static getCurbDriveSideOfRailDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::curbDriveSideOfRailDistance');

  static getEndRampSlopeInput = () =>
    cy.getByTestId('MeasurementsForm::endRampSlope');

  static getServiceAreaWidthInput = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaWidth');

  static getServiceAreaLengthInput = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaLength');

  static getPedestrianCrossingRampTypeDropdownButton = () =>
    cy.getByTestId(
      'MeasurementsForm::pedestrianCrossingRampType::ListboxButton',
    );

  static getPedestrianCrossingRampTypeDropdownOptions = () =>
    cy.getByTestId(
      'MeasurementsForm::pedestrianCrossingRampType::ListboxOptions',
    );

  static getStopAreaSurroundingsAccessibleDropdownButton = () =>
    cy.getByTestId(
      'MeasurementsForm::stopAreaSurroundingsAccessible::ListboxButton',
    );

  static getStopAreaSurroundingsAccessibleDropdownOptions = () =>
    cy.getByTestId(
      'MeasurementsForm::stopAreaSurroundingsAccessible::ListboxOptions',
    );
}
