import styled from "styled-components";
import { Text, TextProps } from '@pancakeswap/uikit'
import { scales, LandingTextProps } from "./types";

const style = {
  [scales.MD]: {
    fontSize: "0.9em",
    fontSizeLg: "1.2em"
  },
  [scales.LG]: {
    fontSize: "1.2em",
    fontSizeLg: "1.8em"
  },
  [scales.XL]: {
    fontSize: "48px",
    fontSizeLg: "90px"
  },
  [scales.XXL]: {
    fontSize: "48px",
    fontSizeLg: "5em"
  },
};

const FuturaText = styled(Text).attrs({ bold: true })<LandingTextProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 600;
  line-height: 1.3;
  font-family: 'Futura', Arial, sans-serif;
  letter-spacing: 0.05em;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
  }
`;

export default FuturaText;
