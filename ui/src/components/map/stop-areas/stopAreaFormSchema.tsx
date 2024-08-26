import { z } from 'zod';
import {
  ValidityPeriodFormState,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../../forms/common';

const nameSchema = z.object({
  value: requiredString,
  lang: requiredString,
});

const scheduledStopPointLabelSchema = z.object({
  label: requiredString,
});

export const stopAreaMemberStopSchema = z.object({
  id: requiredString,
  name: nameSchema,
  scheduled_stop_point: scheduledStopPointLabelSchema,
});

export const stopAreaFormSchema = z
  .object({
    label: requiredString,
    name: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    memberStops: z.array(stopAreaMemberStopSchema),
  })
  .merge(validityPeriodFormSchema);

export type StopAreaFormState = z.infer<typeof stopAreaFormSchema> &
  ValidityPeriodFormState;

export type StopAreaFormMember = z.infer<typeof stopAreaMemberStopSchema>;
