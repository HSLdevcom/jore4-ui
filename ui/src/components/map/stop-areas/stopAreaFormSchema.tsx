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
    memberStops: z.array(stopAreaMemberStopSchema).min(1),
  })
  .merge(validityPeriodFormSchema)
  .superRefine((stopArea, ctx) => {
    const expectedName = stopArea.name;
    const invalidMemberStops = stopArea.memberStops
      .map((stop, index) => ({
        stop,
        index,
        valid: stop.name.value === expectedName,
      }))
      .filter(({ valid }) => !valid);

    if (invalidMemberStops.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['memberStops'],
        message: `stopAreaMemberStopSharedName`,
      });

      invalidMemberStops.forEach(({ stop, index }) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['memberStops', index, 'name', 'value'],
          message: `Member stops need to share a name with the StopArea. Expected name (${expectedName}) but Stop's name is (${stop.name.value})!`,
        });
      });
    }
  });

export type StopAreaFormState = z.infer<typeof stopAreaFormSchema> &
  ValidityPeriodFormState;

export type StopAreaFormMember = z.infer<typeof stopAreaMemberStopSchema>;
