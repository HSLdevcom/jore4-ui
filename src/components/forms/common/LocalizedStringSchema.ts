import { z } from 'zod';

export const localizedStringRequired = z.object({
  fi_FI: z.string().min(1),
  sv_FI: z.string().min(1),
});

export const localizedStringOptional = z.object({
  fi_FI: z.string().optional(),
  sv_FI: z.string().optional(),
});
