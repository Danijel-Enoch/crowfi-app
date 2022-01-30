import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, IconButton, CopyIcon, FlexProps, Button, OpenNewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink } from 'utils'


const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  padding: 8px;
  top: -38px;
  right: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: 100px;
`

export const scales = {
    MD: "md",
    SM: "sm",
    XS: "xs",
  } as const;

export type Scale = typeof scales[keyof typeof scales];

export const scaleVariants = {
    [scales.MD]: {
        fontSize: "16px",
    },
    [scales.SM]: {
        fontSize: "14px",
    },
};


const StyledButton = styled(Button)`
  height: unset;
  padding: unset;
`

const StyledIconButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: unset;
  padding: unset;
`

interface TokenAddressProps extends FlexProps {
    address: string
    truncate?: boolean
    scale?: Scale
}

const TokenAddress: React.FC<TokenAddressProps> = ({scale="md", address, truncate = true, ...props}) => {
    const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
    const { t } = useTranslation()

    const copyAddress = () => {
        if (navigator.clipboard && navigator.permissions) {
        navigator.clipboard.writeText(address).then(() => displayTooltip())
        } else if (document.queryCommandSupported('copy')) {
        const ele = document.createElement('textarea')
        ele.value = address
        document.body.appendChild(ele)
        ele.select()
        document.execCommand('copy')
        document.body.removeChild(ele)
        displayTooltip()
        }
    }

    function displayTooltip() {
        setIsTooltipDisplayed(true)
        setTimeout(() => {
        setIsTooltipDisplayed(false)
        }, 1000)
    }
    return (
        <Flex position="relative" alignItems="center" {...props}>
            <StyledButton onClick={copyAddress} variant="text" fontSize={scaleVariants[scale]}>{truncate ? truncateHash(address) : address}</StyledButton>
            <StyledIconButton variant="text" onClick={copyAddress} ml="4px">
                <CopyIcon color="primary" width="24px" />
            </StyledIconButton>
            <StyledIconButton as="a" href={getBscScanLink(address, 'address')} ml="4px">
                <OpenNewIcon color="primary"  width="24px"/>
            </StyledIconButton>
            <Tooltip isTooltipDisplayed={isTooltipDisplayed}>{t('Copied')}</Tooltip>
        </Flex>
      )
}

export default TokenAddress