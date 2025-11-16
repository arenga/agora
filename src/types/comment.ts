import type { TableRow } from './database';

export type Comment = TableRow<'comments'> & {
  author?: TableRow<'profiles'>;
  children?: Comment[];
};
