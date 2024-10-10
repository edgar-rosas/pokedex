import { z } from 'zod';

const ConfigSchema = z.object({
  DATABASE_NAME: z
    .string()
    .default('sqlite-pokedex')
    .transform((name) => name + '.sqlite3'),
});

export function validate(config: Record<string, unknown>) {
  return ConfigSchema.parse(config);
}
