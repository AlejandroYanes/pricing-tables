export type SimpleValue = Record<any, any>;
export type ListValue = SimpleValue[];
export type TrackedValue = SimpleValue | ListValue;

export interface Params {
  value: TrackedValue;
  idField?: string;
  keysToTrack?: string[];
  onChange: (diff: TrackedValue) => void;
  enabled?: boolean;
}

export type DiffParams = Omit<Params, 'value' | 'onChange' | 'enabled'> & { newValue: TrackedValue; trackedValue: TrackedValue };
