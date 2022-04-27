import React from 'react'
import { Button, Flex, Text } from '@pancakeswap/uikit'
import { NFTAsset, NFTResponse } from 'views/NftMarket/hooks/types';
import { useTranslation } from 'contexts/Localization';
import truncateHash from 'utils/truncateHash';
import { NFTContractTypes } from 'state/types';
import Loading from 'components/Loading';


interface NFTInfoSectionProps {
  nft: NFTAsset | NFTResponse
  availableLoading?: boolean
  available: number
}

const NFTInfoSection: React.FC<NFTInfoSectionProps> = ({ nft, available, availableLoading}) => {
  const { t } = useTranslation()

  return (
    <>
    { 'name' in nft && (
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
        <Text color="secondary" mr="8px">{t('Name')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
        <Text color="primary">{nft.name ?? ''}</Text>
      </Flex>
    </Flex>
    )}
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
        <Text color="secondary" mr="8px">{t('Contract')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
        <Text color="primary">{truncateHash(nft.contractAddress)}</Text>
      </Flex>
    </Flex>
    <Flex justifyContent="center">
      <Flex flex="1" justifyContent="end">
      <Text color="secondary" mr="8px">{t('Type')}:</Text>
      </Flex>
      <Flex flex="1" justifyContent="start">
      <Text color="primary" textTransform='uppercase'>{NFTContractTypes[nft.contractType]}</Text>
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
      <Text color="primary" mr="12px">{available}</Text>
      {availableLoading && (
      <Loading/>
      )}
      </Flex>
    </Flex>
    </>
  )
}

NFTInfoSection.defaultProps = {
  availableLoading: false
}
export default NFTInfoSection
