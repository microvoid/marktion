export type ExtraModifier<T extends {}> = {
  [K in keyof T]: SplitParamsFun<T[K]>;
};

export type SplitParamsFun<T> = T extends (f: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;
