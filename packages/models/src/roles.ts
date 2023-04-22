export type Role = 'USER' | 'ADMIN' | 'GUEST' | null;

export enum ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export const ROLES_LIST: Role[] = ['USER', 'ADMIN'];
