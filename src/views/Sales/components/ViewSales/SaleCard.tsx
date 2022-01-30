import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, LinkExternal } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { StyledCard, LinkWrapper } from 'components/Launchpad/StyledControls'
import { BIG_TEN } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useToken } from 'hooks/Tokens'
import CardHeading from './CardHeading'
import Timer from './Timer'
import { PublicSaleData } from '../../types'

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`
const StyledLinkExternal = styled(LinkExternal)`
  margin-top: 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`

const Progressbar = styled.div<{percent: number}>`
  position: relative;
  height: 10px;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  ::after {
    content: ' ';
    border-radius: 10px;
    position:absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${({ percent }) => percent}%;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`

export interface SaleCardProps {
  sale: PublicSaleData
}

const SaleCard: React.FC<SaleCardProps> = ({sale}) => {
  const { t } = useTranslation()
  const token = useToken(sale.token)

  return (
    <LinkWrapper to={`/presale/${sale.address}`}>

    <StyledCard background="white" borderBackground="rgba(150,150,150,0.1)">
        <CardInnerContainer>
            <CardHeading
                token={token}
                sale={sale}
            />
            <Flex flexDirection="row" justifyContent="space-between">
             <Flex flexDirection="column" alignItems="flex-start" mb="16px">
               <Text color="secondary" fontSize="10px">
                 {t('Rate')}
               </Text>
               <Text color="primary" fontSize="16px">
                 {(t('1 CRO = %rate% %symbol%', {rate: sale.rate.toJSON(), symbol: token ? token.symbol : ''}))}
               </Text>
             </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between">
             <Flex flexDirection="column" alignItems="flex-start" mb="16px">
               <Text color="secondary" fontSize="10px">
                 {t('Soft Cap / Hard Cap')}
               </Text>
               <Text color="primary" fontSize="16px">
                 {(t('%soft% CRO - %hard% CRO', {soft: getFullDisplayBalance(sale.goal), hard: getFullDisplayBalance(sale.cap)}))}
               </Text>
             </Flex>
           </Flex>
            { !sale.canceled && sale.openingTime > new Date().getTime() / 1000 ? (
              <>
              <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="16px">
                <Text color="secondary" fontSize="12px" mb="12px">
                  {t('Presale starts in')}
                </Text>
                <Timer target={sale.openingTime} />
              </Flex>
              </>
            ) : !sale.canceled && sale.closingTime > new Date().getTime() / 1000 && (
              <>
              <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="16px">
                <Text color="secondary" fontSize="12px" mb="12px">
                  {t('Presale ends in')}
                </Text>
                <Timer target={sale.closingTime} />
              </Flex>
              </>
            )}

            <Flex flexDirection="column">
              {/* <Flex flexDirection="row" justifyContent="right">
                <Text color="secondary" fontSize="10px" mb="8px">
                  {t('Participants - ')}
                </Text>
                <Text color="primary" fontSize="10px">
                  {participants}
                </Text>
              </Flex> */}
              <Progressbar percent={sale.weiRaised.multipliedBy(100).div(sale.cap).toNumber()} />
              <Flex justifyContent="space-between" mt="8px">
                <Text color="secondary" fontSize="10px">
                {sale.weiRaised.multipliedBy(100).div(sale.cap).toFixed(0)}%
                </Text>
                <Text color="primary" fontSize="10px">
                  {getFullDisplayBalance(sale.cap)} {t('CRO')}
                </Text>
              </Flex>
            </Flex>

            
        </CardInnerContainer>
    </StyledCard>
    </LinkWrapper>
  )
}

export default SaleCard
