export interface JCrushCSSOptions {
  html?: string[];
  inline?: boolean;
  appendExt?: boolean;
  rename?: string;
  eval?: boolean;
  let?: boolean;
  semi?: boolean;
  strip?: boolean;
  reps?: number;
  prog?: boolean;
  fin?: boolean;
  maxLen?: number;
  omit?: string[];
  clean?: boolean;
  words?: boolean;
  trim?: boolean;
  break?: string[];
  split?: string[];
  escSafe?: boolean;
}

declare function gulpJCrushCSS(opts?: JCrushCSSOptions): NodeJS.ReadWriteStream;

export = gulpJCrushCSS;