import { z } from 'zod';
import {
  ValidityPeriodFormState,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../common';

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
    nameLongFin: z.string().optional(),
    nameLongSwe: z.string().optional(),
    abbreviationFin: z.string().optional(),
    abbreviationSwe: z.string().optional(),
    abbreviation5CharFin: z.string().optional(),
    abbreviation5CharSwe: z.string().optional(),
    nameSwe: requiredString,
    privateCode: requiredString,
    name: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    stopTypes: z.object({
      railReplacement: z.boolean(),
      interchange: z.boolean(),
    }),
    quays: z.array(stopAreaMemberStopSchema),
  })
  .merge(validityPeriodFormSchema);

export type StopAreaFormState = z.infer<typeof stopAreaFormSchema> &
  ValidityPeriodFormState;

export type StopAreaFormMember = z.infer<typeof stopAreaMemberStopSchema>;
