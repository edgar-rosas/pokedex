import { QueryFailedError } from 'typeorm';

export const queryFailedGuard = (
  err: unknown,
): err is QueryFailedError & { code: string } =>
  err instanceof QueryFailedError;
