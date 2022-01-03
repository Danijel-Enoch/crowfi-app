export const scales = {
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
    XSL: "xsl",
    XXL: "xxl",
  } as const;
export type Scales = typeof scales[keyof typeof scales];

export interface LandingTextProps {
    scale?: Scales;
}