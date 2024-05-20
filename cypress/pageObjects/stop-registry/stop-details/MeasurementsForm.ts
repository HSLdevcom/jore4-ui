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

  getPlatformEdgeWarningAreaDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::platformEdgeWarningArea::ListboxButton');

  getPlatformEdgeWarningAreaDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::platformEdgeWarningArea::ListboxOptions');

  getSidewalkAccessibleConnectionDropdownButton = () =>
    cy.getByTestId(
      'MeasurementsForm::sidewalkAccessibleConnection::ListboxButton',
    );

  getSidewalkAccessibleConnectionDropdownOptions = () =>
    cy.getByTestId(
      'MeasurementsForm::sidewalkAccessibleConnection::ListboxOptions',
    );

  getGuidanceStripeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::guidanceStripe::ListboxButton');

  getGuidanceStripeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::guidanceStripe::ListboxOptions');

  getServiceAreaStripesDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaStripes::ListboxButton');

  getServiceAreaStripesDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::serviceAreaStripes::ListboxOptions');

  getGuidanceTypeDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::guidanceType::ListboxButton');

  getGuidanceTypeDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::guidanceType::ListboxOptions');

  getGuidanceTilesDropdownButton = () =>
    cy.getByTestId('MeasurementsForm::guidanceTiles::ListboxButton');

  getGuidanceTilesDropdownOptions = () =>
    cy.getByTestId('MeasurementsForm::guidanceTiles::ListboxOptions');

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
