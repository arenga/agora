import type { TableRow } from './database';

export type PostCategory = TableRow<'posts'>['category'];

export type Post = TableRow<'posts'> & {
  author?: TableRow<'profiles'>;
  comments?: TableRow<'comments'>[];
};
