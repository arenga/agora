import type { TableRow } from './database';

export type UserProfile = TableRow<'profiles'> & {
  email?: string;
};
