import styled from "styled-components";
import { Text, TextProps } from '@pancakeswap/uikit'
import { scales, LandingTextProps } from "./types";

const style = {
  [scales.SM]: {
    fontSize: "20px",
    fontSizeLg: "24px",
    shadow: "2px 2px rgba(255, 255, 255, 0.3)"
  },
  [scales.MD]: {
    fontSize: "24px",
    fontSizeLg: "32px",
    shadow: "1px 2px rgba(255, 255, 255, 0.2)"
  },
  [scales.LG]: {
    fontSize: "32px",
    fontSizeLg: "48px",
    shadow: "1px 3px rgba(255, 255, 255, 0.2)"
  },
  [scales.XSL]: {
    fontSize: "40px",
    fontSizeLg: "64px",
    shadow: "2px 3px rgba(255, 255, 255, 0.2)"
  },
  [scales.XL]: {
    fontSize: "48px",
    fontSizeLg: "90px",
    shadow: "3px 4px rgba(255, 255, 255, 0.2)"
  },
  [scales.XXL]: {
    fontSize: "48px",
    fontSizeLg: "90px",
    shadow: "3px 4px rgba(255, 255, 255, 0.2)"
  },
};

const LandingHeading = styled(Text).attrs({ bold: true })<LandingTextProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 400;
  line-height: 1.1;
  font-family: 'Insanibc', 'Comfortaa', sans-serif;
  text-shadow: ${({ scale }) => style[scale || scales.MD].shadow};

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
  }
`;

export default LandingHeading;
