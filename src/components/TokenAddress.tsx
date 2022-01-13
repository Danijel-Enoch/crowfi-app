import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, IconButton, CopyIcon, FlexProps } from '@pancakeswap/uikit'
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
interface TokenAddressProps extends FlexProps {
    address: string
}

const TokenAddress: React.FC<TokenAddressProps> = ({address, ...props}) => {
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
        <Flex position="relative" {...props}>
            <LinkExternal href={getBscScanLink(address, 'address')}>{truncateHash(address)}</LinkExternal>
            <IconButton variant="text" onClick={copyAddress}>
                <CopyIcon color="primary" width="24px" />
            </IconButton>
            <Tooltip isTooltipDisplayed={isTooltipDisplayed}>{t('Copied')}</Tooltip>
        </Flex>
      )
}

export default TokenAddress