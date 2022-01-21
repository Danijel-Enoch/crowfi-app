import { Link } from "react-router-dom";
import styled from "styled-components";

export const LinkWrapper = styled(Link)`
text-decoration: none;
:hover {
  cursor: pointer;
  opacity: 0.7;
}
`