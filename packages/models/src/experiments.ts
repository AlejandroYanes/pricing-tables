export interface Experiment {
  title: string;
  created_at: number;
  running: boolean;
  variants: string[];
  distribution: { [key: string]: number };
}

export const VISITOR_ID_COOKIE = 'dealo_x_visitor_id';

export const LANDING_PAGE_EXPERIMENT = 'landing_page';
export const LANDING_PAGE_EXPERIMENT_COOKIE = 'dealo_x_landing_page';
