export type Event = 'view' | 'signup';

export interface Analytic {
  id: string;
  experiment: string;
  variant: string;
  event: Event;
  country?: string;
  region?: string;
  createdAt: Date;
}
