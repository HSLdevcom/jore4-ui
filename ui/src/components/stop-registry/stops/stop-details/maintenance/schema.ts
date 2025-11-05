import { z } from 'zod';

export const maintenanceDetailsFormSchema = z.object({
  maintainers: z.object({
    owner: z.string().nullable(),
    maintenance: z.string().nullable(),
    winterMaintenance: z.string().nullable(),
    infoUpkeep: z.string().nullable(),
    cleaning: z.string().nullable(),
    shelterMaintenance: z.string().nullable(),
  }),
});

export type MaintenanceDetailsFormState = z.infer<
  typeof maintenanceDetailsFormSchema
>;
