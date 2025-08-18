import { z } from 'zod';
import { selectedStopSchema } from '../../../../components/SelectMemberStops/common';

export const terminalAddStopsFormSchema = z.object({
  selectedStops: z.array(selectedStopSchema).default([]),
});

export type TerminalAddStopsFormState = z.infer<
  typeof terminalAddStopsFormSchema
>;
