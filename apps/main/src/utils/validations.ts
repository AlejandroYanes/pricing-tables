import { z } from 'zod';
import { isCuid } from '@paralleldrive/cuid2';

export const cuidZodValidator = z.string().refine((value) => isCuid(value), { message: 'Invalid cuid' });

export const isEmptyObject = (obj: Record<string, unknown>) => Object.keys(obj).length === 0;
