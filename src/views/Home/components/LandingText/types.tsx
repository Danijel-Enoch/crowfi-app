export const scales = {
    MD: "md",
    LG: "lg",
    XL: "xl",
    XXL: "xxl",
  } as const;
export type Scales = typeof scales[keyof typeof scales];

export interface LandingTextProps {
    scale?: Scales;
}