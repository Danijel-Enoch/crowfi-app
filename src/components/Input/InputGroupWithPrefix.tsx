import { Box, Input } from "@pancakeswap/uikit";
import React, { cloneElement, useMemo, useState } from "react";
import styled from "styled-components";
import { InputGroupWithPrefixProps } from "./types";

const getPadding = (scale: string, hasIcon: boolean, offset?: number) => {
  if (!hasIcon) {
    return `${16 + (offset ?? 0)}px`;
  }

  switch (scale) {
    case "sm":
      return `${32 + (offset ?? 0)}px`;
    case "lg":
      return `${56 + (offset ?? 0)}px`;
    case "md":
    default:
      return `${48 + (offset ?? 0)}px`;
  }
};

const StyledInputGroup = styled(Box)<{ scale: string; hasStartIcon: boolean; hasEndIcon: boolean; offset?:number }>`
  ${Input} {
    padding-left: ${({ hasStartIcon, scale, offset }) => getPadding(scale, hasStartIcon, offset)};
    padding-right: ${({ hasEndIcon, scale }) => getPadding(scale, hasEndIcon)};
  }
`;

const InputIcon = styled.div<{ scale: string; isEndIcon?: boolean }>`
  align-items: center;
  display: flex;
  height: 100%;
  position: absolute;
  top: 0;

  ${({ isEndIcon, scale }) =>
    isEndIcon
      ? `
    right: ${scale === "sm" ? "8px" : "16px"};
  `
      : `
    left: ${scale === "sm" ? "8px" : "16px"};
  `}
`;

const PrefixElementWrapper = styled.div<{ scale: string; hasStartIcon: boolean;}>`
  align-items: center;
  display: flex;
  height: 100%;
  position: absolute;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.6;
  top: 0;
  left: ${({ hasStartIcon, scale }) => getPadding(scale, hasStartIcon)};
`;

const InputGroupWithPrefix = ({ scale = "md", startIcon, endIcon, prefixText, children, ...props }: InputGroupWithPrefixProps): JSX.Element => {
  const [prefixElement, setPrefixElement] = useState<HTMLElement | null>(null)

  const prefixWidth = useMemo(() => {
    if (prefixElement) {
      return prefixElement.clientWidth
    }
    return 0
  }, [prefixElement])

  return (
  <StyledInputGroup
    scale={scale}
    width="100%"
    position="relative"
    hasStartIcon={!!startIcon}
    hasEndIcon={!!endIcon}
    offset={prefixWidth}
    {...props}
  >
    {startIcon && <InputIcon scale={scale}>{startIcon}</InputIcon>}
    { prefixText && <PrefixElementWrapper scale={scale} hasStartIcon={!!startIcon} ref={setPrefixElement}>{prefixText}</PrefixElementWrapper>}
    {cloneElement(children, { scale })}
    {endIcon && (
      <InputIcon scale={scale} isEndIcon>
        {endIcon}
      </InputIcon>
    )}
  </StyledInputGroup>
  )
};

export default InputGroupWithPrefix;
