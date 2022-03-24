import React from 'react'
import { Button, Flex, Text } from '@pancakeswap/uikit'
import { NFTResponse } from 'views/NftMarket/hooks/types';
import { useTranslation } from 'contexts/Localization';
import truncateHash from 'utils/truncateHash';


interface NFTInfoSectionProps {
  nft: NFTResponse
  available: number
}

const NFTInfoSection: React.FC<NFTInfoSectionProps> = ({ nft, available}) => {
  const { t } = useTranslation()

  return (
    <>
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
        <Text color="secondary" mr="8px">{t('Name')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
        <Text color="primary">{nft.name}</Text>
      </Flex>
    </Flex>
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
        <Text color="secondary" mr="8px">{t('Contract')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
        <Text color="primary">{truncateHash(nft.collection.contract)}</Text>
      </Flex>
    </Flex>
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
      <Text color="secondary" mr="8px">{t('Type')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
      <Text color="primary" textTransform='uppercase'>{nft.collection.contractType}</Text>
      </Flex>
    </Flex>
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
      <Text color="secondary" mr="8px">{t('Token Id')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
      <Text color="primary">{nft.tokenId}</Text>
      </Flex>
    </Flex>
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
      <Text color="secondary" mr="8px">{t('Available')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
      <Text color="primary">{available}</Text>
      </Flex>
    </Flex>
    </>
  )
}

export default NFTInfoSection
