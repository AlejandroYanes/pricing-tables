export interface Experiment {
  title: string;
  created_at: number;
  running: boolean;
  variants: string[];
  distribution: { [key: string]: number };
  results: {
    [key: string]: {
      visits: number;
      signups: number;
    };
  };
}
