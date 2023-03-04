import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

export function calculateTotal(count: number) {
  if (count % ITEMS_PER_PAGE_LIMIT !== 0) {
    return Math.floor((count / ITEMS_PER_PAGE_LIMIT) + 1);
  }
  return Math.floor(count / ITEMS_PER_PAGE_LIMIT);
}
