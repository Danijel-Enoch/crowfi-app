
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { ChevronDownIcon, ChevronUpIcon } from '@pancakeswap/uikit'


const ContentWrapper = styled.div<{expanded?: boolean}>`
    color: rgb(112, 122, 131);
    text-align: center;
    max-width: 800px;
    padding: 20px;
`

const MarkdownWrapper = styled.div<{expanded?: boolean}>`
    max-height:${({ expanded }) => expanded? '600px': '100px'};
    overflow: hidden;
    transition: max-height 100ms ease 0s;
    ${(props) =>
      !props.expanded &&
      css`
      -webkit-mask: linear-gradient(rgb(255, 255, 255) 45%, transparent);
      `}
    * {
        font-size: 16px;
    }

    * {
        padding: revert;
        margin: revert;
        font-size: revert;
        quotes: revert;
    }

`
const ExpandableButton = styled.div<{expanded?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
      background: rgba(0,0,0,0.1);
  }

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`


interface DescriptionSectionProps {
    text?: string
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({text}) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <ContentWrapper>
            <MarkdownWrapper expanded={expanded}>
                <ReactMarkdown>
                {text}
                </ReactMarkdown>
            </MarkdownWrapper>

            <ExpandableButton
            onClick={() => setExpanded(!expanded)}
            expanded={expanded}
            >
                {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </ExpandableButton>
        </ContentWrapper>
    )
}

export default DescriptionSection 