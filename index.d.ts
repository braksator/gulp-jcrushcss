declare module 'gulp-jcrushcss' {
  export interface JCrushCSSOptions {
    html?: Array<string>;
    inline?: boolean;
    appendExt?: boolean;
    eval?: boolean;
    let?: boolean;
    semi?: boolean;
    strip?: boolean;
    reps?: number;
    prog?: boolean;
    fin?: boolean;
    maxLen?: number;
    omit?: Array<string>;
    clean?: boolean;
    words?: boolean;
    trim?: boolean;
    break?: Array<string>;
    split?: Array<string>;
    escSafe?: boolean;
  }

  export function jcrushCssCode(code: string, opts?: JCrushCSSOptions): string;
  export function jcrushCssFile(inputFile: string, outputFile: string, opts?: JCrushCSSOptions): void;
  export function gulp(opts?: JCrushCSSOptions): any;
}