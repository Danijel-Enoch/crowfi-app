import styled from "styled-components";
import { Text, TextProps } from '@pancakeswap/uikit'
import { scales, LandingTextProps } from "./types";

const style = {
  [scales.MD]: {
    fontSize: "1em",
    fontSizeLg: "1.2em",
    shadow: "1px 2px rgba(255, 255, 255, 0.2)"
  },
  [scales.LG]: {
    fontSize: "1.8em",
    fontSizeLg: "2.1em",
    shadow: "2px 3px rgba(255, 255, 255, 0.2)"
  },
  [scales.XL]: {
    fontSize: "48px",
    fontSizeLg: "90px",
    shadow: "3px 4px rgba(255, 255, 255, 0.2)"
  },
  [scales.XXL]: {
    fontSize: "4em",
    fontSizeLg: "5em",
    shadow: "3px 4px rgba(255, 255, 255, 0.2)"
  },
};

const GothamText = styled(Text).attrs({ bold: true })<LandingTextProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 600;
  line-height: 1.1;
  font-family: 'Gotham', Arial, sans-serif;
  letter-spacing: 0.05em;
  text-shadow: ${({ scale }) => style[scale || scales.MD].shadow};

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
  }
`;

export default GothamText;
