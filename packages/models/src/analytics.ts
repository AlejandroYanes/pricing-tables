export type Event = 'view' | 'signup';

export interface Analytic {
  id: string;
  experiment: string;
  variant: string;
  event: Event;
  visitorId?: string;
  country?: string;
  region?: string;
  createdAt: Date;
}
