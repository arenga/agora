import type { TableRow } from './database';

export type Philostory = TableRow<'philostories'> & {
  philosopher?: TableRow<'philosophers'> | null;
  isBookmarked?: boolean;
  isHighlighted?: boolean;
};
