import { z } from 'zod';

export const terminalOwnerSchema = z.object({
  contractId: z.string().max(255).optional().nullable(),
  note: z.string().max(255).optional().nullable(),
  ownerRef: z.string().optional().nullable(),
});

export type TerminalOwnerFormState = z.infer<typeof terminalOwnerSchema>;
