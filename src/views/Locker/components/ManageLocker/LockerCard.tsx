import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, Flex, Text, Button, LinkExternal, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedLock } from 'state/types'
import { usePairToken, useToken } from 'hooks/Tokens'
import { BIG_ZERO } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { StyledCard, LinkWrapper } from 'components/Launchpad/StyledControls'
import TokenAddress from 'components/TokenAddress'
import CardHeading from './CardHeading'
import Timer from './Timer'


const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

export interface LockerCardProps {
  lock: DeserializedLock
}

const LockerCard: React.FC<LockerCardProps> = ({lock}) => {
  const { t } = useTranslation()
  const token = useToken(lock.tokenAddress)
  const pair = usePairToken(lock.tokenAddress)
  const token0 = useToken(pair ? pair.token0Address : null)
  const token1 = useToken(pair ? pair.token1Address : null)
  const unlocked = lock.amount.eq(BIG_ZERO)

  return (
    <StyledCard background="white" borderBackground="rgba(150,150,150,0.1)">
        <CardInnerContainer>
            <CardHeading
                token={token}
                token0={token0}
                token1={token1}
            />
            { unlocked ? (
              <Flex justifyContent="center" alignItems="center">
                <Text bold color="primary">{t('Unlocked')}:</Text>
              </Flex>
            ) : (
              <>
              <Text color="secondary" textAlign="center" fontSize="14px">
                {t('Ends')}: {new Date(lock.unlockDate * 1000).toLocaleDateString()}
              </Text>
              <Flex justifyContent="center" alignItems="center" mt="16px">
                <Timer target={lock.unlockDate} />
              </Flex>
              </>
            )}
            <Flex flexDirection="column" alignItems="center">
                <Text color="secondary" fontSize='12px'>{t('Locked amount')}</Text>
                { token ? (
                  <Text bold color="primary">
                      {getFullDisplayBalance(lock.amount, token.decimals)} {token.symbol}
                  </Text>
                ) : (
                  <Skeleton width="80px" height="20px" />
                )}
            </Flex>
            <Flex flexDirection="column" alignItems="center" mt="16px">
                <Text color="secondary" fontSize='12px'>{t('Address')}:</Text>
                <TokenAddress address={lock.tokenAddress} />
            </Flex>
            <Flex flexDirection="column" alignItems="center" mt="16px">
              <Text color="secondary" fontSize='12px'>{t('Owner')}:</Text>
              <TokenAddress address={lock.owner} />
            </Flex>
            <Button as="a" href={`/lockers/${lock.id}`} mt="12px">
              {t('View')}
            </Button>
        </CardInnerContainer>

    </StyledCard>
  )
}

export default LockerCard
