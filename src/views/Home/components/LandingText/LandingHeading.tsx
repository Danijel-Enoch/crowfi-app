import styled from "styled-components";
import { Text, TextProps } from '@pancakeswap/uikit'
import { scales, LandingTextProps } from "./types";

const style = {
  [scales.SM]: {
    fontSize: "20px",
    fontSizeLg: "24px"
  },
  [scales.MD]: {
    fontSize: "24px",
    fontSizeLg: "32px"
  },
  [scales.LG]: {
    fontSize: "32px",
    fontSizeLg: "48px"
  },
  [scales.XSL]: {
    fontSize: "40px",
    fontSizeLg: "64px"
  },
  [scales.XL]: {
    fontSize: "48px",
    fontSizeLg: "90px"
  },
  [scales.XXL]: {
    fontSize: "48px",
    fontSizeLg: "90px"
  },
};

const LandingHeading = styled(Text).attrs({ bold: true })<LandingTextProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 400;
  line-height: 1.1;
  font-family: 'Insanibc', 'Comfortaa', sans-serif;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
  }
`;

export default LandingHeading;
