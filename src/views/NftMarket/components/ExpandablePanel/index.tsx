import React, { useRef, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Flex, Heading, Text } from '@pancakeswap/uikit'

const Wrapper = styled(Flex).attrs({flexDirection: "column"})<{hasTopBorder:boolean, hasBottomBorder: boolean, topRadius: number, bottomRadius:number}>`
    border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
    border-top-left-radius: ${({ topRadius }) => `${topRadius}px`};
    border-top-right-radius: ${({ topRadius }) => `${topRadius}px`};
    border-bottom-right-radius: ${({ bottomRadius }) => `${bottomRadius}px`};
    border-bottom-left-radius: ${({ bottomRadius }) => `${bottomRadius}px`};
    background: white;
    overflow: hidden;

    border-top-width: ${({ hasTopBorder }) => hasTopBorder ? '1px' : '0px'};
    border-bottom-width: ${({ hasBottomBorder }) => hasBottomBorder ? '1px' : '0px'};
`
const Header = styled(Flex).attrs({justifyContent: 'space-between'})<{expanded: boolean, enabled: boolean}>`
    background: rgba(231, 241, 248, 0.3);
    border-bottom: ${({ expanded, theme }) => expanded ? `1px solid ${theme.colors.cardBorder}` : 'unset'};
    padding: 8px;
    min-height: 48px;

    ${(props) =>
        props.enabled &&
        css`
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
        `}
    
`
const ChildrenWrapper = styled.div<{expanded: boolean}>`
    max-height: ${({ expanded }) => expanded ? 'auto' : '0px'};
    overflow:hidden;
    transition: max-height 100ms ease 0s;
`

interface ExpandablePanelProps {
    icon?: JSX.Element
    title?: string
    collapsed?: boolean
    enabled?: boolean
    hasTopBorder?: boolean
    hasBottomBorder?: boolean
    topRadius?:number
    bottomRadius?:number
}

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
    icon, 
    title, 
    collapsed, 
    enabled, 
    hasBottomBorder, 
    hasTopBorder,
    topRadius,
    bottomRadius,
    children, 
}) => {

    const [expanded, setExpanded] = useState(!collapsed)

    return (
        <Wrapper hasTopBorder={hasTopBorder} hasBottomBorder={hasBottomBorder} topRadius={topRadius} bottomRadius={bottomRadius}>
            <Header 
                enabled={enabled}
                expanded={expanded}
                onClick={() => enabled && setExpanded(!expanded)}
            >
                <Flex alignItems="center">
                    {icon}
                    <Text bold fontSize="16px" ml="12px">
                        {title}
                    </Text>
                </Flex>

                { enabled && (
                    <>
                    {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </>
                )}
                
            </Header>
            <ChildrenWrapper expanded={expanded}>
                {children}
            </ChildrenWrapper>
        </Wrapper>
    )
}

ExpandablePanel.defaultProps = {
    enabled: true,
    hasTopBorder: true,
    hasBottomBorder: true,
    topRadius: 12,
    bottomRadius: 12
}

export default ExpandablePanel