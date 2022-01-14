import React from 'react'
import { NoProfileAvatarIcon, Flex, Heading, Skeleton, Text, Box } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'

const Desktop = styled(Flex)`
  align-items: center;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const Mobile = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const Sticker = styled(Flex)`
  height: 92px;
  width: 92px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  border: 3px solid ${({ theme }) => theme.colors.invertedContrast};
  border-radius: ${({ theme }) => theme.radii.circle};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const StyledNoProfileAvatarIcon = styled(NoProfileAvatarIcon)`
  height: 100%;
  width: 100%;
`

const UserDetail = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const truncatedAddress = truncateHash(account)

  return (
    <>
      <Desktop>
        <Box mr="24px">
          <Sticker><StyledNoProfileAvatarIcon /></Sticker>
        </Box>
        <Flex flexDirection="column">
          { !account ? (
            <Skeleton width={160} height={16} my="4px" />
          ) : (
            <Text fontSize="16px"> {t('Connected with %address%', { address: truncatedAddress })}</Text>
          )}
        </Flex>
      </Desktop>
    </>
  )
}

export default UserDetail
