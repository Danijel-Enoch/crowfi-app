import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Card, Flex, Text, Button, LinkExternal, Skeleton } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { StyledCard } from 'components/Launchpad/StyledControls'
import TokenAddress from 'components/TokenAddress'
import { LinkWrapper } from 'views/Launchpad/styled'
import CardHeading from './CardHeading'
import Timer from './Timer'


const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

export interface LockerCardProps {
  token?: Token
  totalSupply: BigNumber
  lockedAmount: BigNumber
  unlockAt?: number
  owner?: string
  unlocked?: boolean
}

const LockerCard: React.FC<LockerCardProps> = ({token, totalSupply, lockedAmount, unlockAt, owner, unlocked = false}) => {
  const { t } = useTranslation()

  return (
    <LinkWrapper to="/utilities/lockers/123">
    <StyledCard background="white" borderBackground="rgba(150,150,150,0.1)">
        <CardInnerContainer>
            <CardHeading
                symbol={token.symbol}
                name={token.name} 
            />
            { unlocked ? (
              <Flex justifyContent="center" alignItems="center">
                <Text bold color="primary">{t('Unlocked')}:</Text>
              </Flex>
            ) : (
              <>
              <Text color="secondary" textAlign="center" fontSize="14px">
                {t('Ends')}: {new Date(unlockAt * 1000).toLocaleDateString()}
              </Text>
              <Flex justifyContent="center" alignItems="center" mt="16px">
                <Timer target={unlockAt} />
              </Flex>
              </>
            )}
            <Flex flexDirection="column" alignItems="center">
                <Text color="secondary" fontSize='12px'>{t('Locked amount')}</Text>
                { lockedAmount ? (
                  <Text bold color="primary">
                      {getFullDisplayBalance(lockedAmount, token.decimals)}
                  </Text>
                ) : (
                  <Skeleton width="80px" height="48px" />
                )}
            </Flex>
            <Flex flexDirection="column" alignItems="center" mt="16px">
                <Text color="secondary" fontSize='12px'>{t('Address')}:</Text>
                <TokenAddress address={token.address} />
            </Flex>
            { owner && (
              <Flex flexDirection="column" alignItems="center" mt="16px">
                <Text color="secondary" fontSize='12px'>{t('Owner')}:</Text>
                <TokenAddress address={owner} />
              </Flex>
            )}

            
        </CardInnerContainer>
    </StyledCard>
    </LinkWrapper>
  )
}

export default LockerCard
