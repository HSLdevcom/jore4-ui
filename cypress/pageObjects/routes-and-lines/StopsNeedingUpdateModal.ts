import { createSimplePageObject } from '../createSimplePageObject';

export const StopsNeedingUpdateModal = createSimplePageObject(
  'StopsNeedingUpdateModal',
  [
    'StopsNeedingUpdateModal::modal',
    'StopsNeedingUpdateModal::cancelButton',
    'StopsNeedingUpdateModal::confirmButton',
  ],
  (base) => ({
    ...base,
    getStopLink: (publicCode: string) =>
      cy.get(
        `[data-testid^="StopsNeedingUpdateModal::stopLink::${publicCode}"]`,
      ),
  }),
);
