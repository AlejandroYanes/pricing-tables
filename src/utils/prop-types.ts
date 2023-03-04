
export function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
  return fn as (arg: T) => R;
}

type negateAttributes<T> = {
  [TP in keyof T]?: never;
};

export type inferOppositeExcludingType<T, R> = (
  (T & negateAttributes<R>) | (R & negateAttributes<T>)
);
