export type Role = 'USER' | 'ADMIN' | 'PAID';

export enum ROLES {
  USER = 'USER',
  PAID = 'PAID',
  ADMIN = 'ADMIN',
}

export const ROLES_LIST: Role[] = ['USER', 'PAID', 'ADMIN'];
