export class MeasurementsForm {
  getStopTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::stopType::ListboxButton');

  getStopTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::stopType::ListboxOptions');

  getCurvedStopDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::curvedStop::ListboxButton');

  getCurvedStopDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::curvedStop::ListboxOptions');

  getShelterTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::shelterType::ListboxButton');

  getShelterTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::shelterType::ListboxOptions');

  getShelterLaneDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::shelterLaneDistance');

  getCurbBackOfRailDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::curbBackOfRailDistance');

  getStopAreaSideSlopeInput = () =>
    cy.getByTestId('MeasurementsForm::stopAreaSideSlope');

  getStopAreaLengthwiseSlopeInput = () =>
    cy.getByTestId('MeasurementsForm::stopAreaLengthwiseSlope');

  getStructureLaneDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::structureLaneDistance');

  getStopElevationFromRailTopInput = () =>
    cy.getByTestId('MeasurementsForm::stopElevationFromRailTop');

  getStopElevationFromSidewalkInput = () =>
    cy.getByTestId('MeasurementsForm::stopElevationFromSidewalk');

  getLowerCleatHeightInput = () =>
    cy.getByTestId('MeasurementsForm::lowerCleatHeight');

  getPlatformEdgeWarningAreaCheckbox = () =>
    cy.getByTestId('MeasurementsForm::platformEdgeWarningArea');

  getSidewalkAccessibleConnectionCheckbox = () =>
    cy.getByTestId('MeasurementsForm::sidewalkAccessibleConnection');

  getGuidanceStripeCheckbox = () =>
    cy.getByTestId('MeasurementsForm::guidanceStripe');

  getServiceAreaStripesCheckbox = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaStripes');

  getGuidanceTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::guidanceType::ListboxButton');

  getGuidanceTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::guidanceType::ListboxOptions');

  getGuidanceTilesCheckbox = () =>
    cy.getByTestId('MeasurementsForm::guidanceTiles');

  getMapTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::mapType::ListboxButton');

  getMapTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::mapType::ListboxOptions');

  getCurbDriveSideOfRailDistanceInput = () =>
    cy.getByTestId('MeasurementsForm::curbDriveSideOfRailDistance');

  getEndRampSlopeInput = () => cy.getByTestId('MeasurementsForm::endRampSlope');

  getServiceAreaWidthInput = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaWidth');

  getServiceAreaLengthInput = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaLength');

  getPedestrianCrossingRampTypeDropdownButton = () =>
    cy.getByTestId(
      'MeasurementsForm::pedestrianCrossingRampType::ListboxButton',
    );

  getPedestrianCrossingRampTypeDropdownOptions = () =>
    cy.getByTestId(
      'MeasurementsForm::pedestrianCrossingRampType::ListboxOptions',
    );

  getStopAreaSurroundingsAccessibleDropdownButton = () =>
    cy.getByTestId(
      'MeasurementsForm::stopAreaSurroundingsAccessible::ListboxButton',
    );

  getStopAreaSurroundingsAccessibleDropdownOptions = () =>
    cy.getByTestId(
      'MeasurementsForm::stopAreaSurroundingsAccessible::ListboxOptions',
    );
}
