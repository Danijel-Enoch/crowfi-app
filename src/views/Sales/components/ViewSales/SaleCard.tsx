import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, LinkExternal } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { StyledCard, LinkWrapper } from 'components/Launchpad/StyledControls'
import CardHeading from './CardHeading'
import Timer from './Timer'

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
  token?: Token
  usdPrice: BigNumber
  marketCapUsd: BigNumber
  soldUsd: BigNumber
  participants?: number
  startDate?: number
  endDate?: number
}

const SaleCard: React.FC<SaleCardProps> = ({token, usdPrice, marketCapUsd, soldUsd, participants, startDate, endDate}) => {
  const { t } = useTranslation()

  return (
    <LinkWrapper to="/presale/1234">

    <StyledCard background="white" borderBackground="rgba(150,150,150,0.1)">
        <CardInnerContainer>
            <CardHeading
                token={token}
                startDate={startDate}
                endDate={endDate}
            />
            <Text color="secondary" textAlign="center" fontSize="14px" mt="16px" mb="16px">
              {t('Crow is a decentralized currency that does not discriminate. Any individual or business can realize the advantages of finance.')}
            </Text>
            { startDate > new Date().getTime() / 1000 ? (
              <>
              <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="16px">
                <Text color="secondary" fontSize="12px" mb="12px">
                  {t('Presale starts in')}
                </Text>
                <Timer target={startDate} />
              </Flex>
              </>
            ) : endDate > new Date().getTime() / 1000 && (
              <>
              <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="16px">
                <Text color="secondary" fontSize="12px" mb="12px">
                  {t('Presale ends in')}
                </Text>
                <Timer target={endDate} />
              </Flex>
              </>
            )}
            <Flex flexDirection="row" justifyContent="space-between">
              <Flex flexDirection="column" alignItems="flex-start" mb="16px">
                <Text color="secondary" fontSize="10px">
                  {t('Swap rate')}
                </Text>
                <Text color="primary" fontSize="16px">
                  {(t('1 %symbol% = %price% USDT'), token.symbol, usdPrice.toJSON())}
                </Text>
              </Flex>
              <Flex flexDirection="column" alignItems="end" mb="16px">
                <Text color="secondary" fontSize="10px">
                  {t('Market Cap')}
                </Text>
                <Text color="primary" fontSize="16px">
                  {marketCapUsd.toJSON()}
                </Text>
              </Flex>
            </Flex>

            <Flex flexDirection="column">
              <Flex flexDirection="row" justifyContent="right">
                <Text color="secondary" fontSize="10px" mb="8px">
                  {t('Participants - ')}
                </Text>
                <Text color="primary" fontSize="10px">
                  {participants}
                </Text>
              </Flex>
              <Progressbar percent={soldUsd.multipliedBy(100).div(marketCapUsd).toNumber()} />
              <Flex justifyContent="space-between" mt="8px">
                <Text color="secondary" fontSize="10px">
                  {soldUsd.multipliedBy(100).div(marketCapUsd).toFixed(0)}%
                </Text>
                <Text color="primary" fontSize="10px">
                  {soldUsd.toJSON()}
                </Text>
              </Flex>
            </Flex>

            
        </CardInnerContainer>
    </StyledCard>
    </LinkWrapper>
  )
}

export default SaleCard
