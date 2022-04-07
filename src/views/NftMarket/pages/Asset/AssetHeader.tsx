import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { User, Users } from 'react-feather'
import { Flex, Text, Heading, CardViewIcon, ListViewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NFTAssetType } from 'state/types'
import truncateHash from 'utils/truncateHash'
import { BalanceResponse, NFTBalanceResponse, NFTCollection, NFTMeta, NFTResponse } from '../../hooks/types'

interface AssetHeaderProps {
    metadata: NFTMeta
    collection?: NFTCollection
    nft?: NFTResponse
    balance?: NFTBalanceResponse
    account?: string
}

const AssetHeader: React.FC<AssetHeaderProps> = ({metadata, collection, nft, balance, account}) => {

    const { t } = useTranslation()

    const assetUrl = useMemo(() => {
        if (metadata.properties?.type === NFTAssetType.Image) {
            return metadata.image
        }

        return metadata.animation_url

    }, [metadata])

    const totalBalance = useMemo(() => {
        return balance ? balance.total : 0
    }, [balance])

    const myBalance = useMemo(() =>  {
        return balance ? balance.balance : 0
    }, [balance])

    
    return (
        <Flex flexDirection="column" margin="8px">
            {collection && (
                <Link to={`/nft/collection/${collection.slug}`}>
                    <Text fontSize='14px'>{collection.name}</Text>
                </Link>
            )}
            <Heading margin="8px 0px">
                {metadata?.name}
            </Heading>
            { balance && balance.owners > 0 && (
            <Flex alignItems="center">
                {balance.owners === 1 ? (
                    <>
                    <Text fontSize='14px'mr="8px">Owned by </Text>
                    <Link to={`/nft/profile/${balance.owner?.address}`}>
                        <Text fontSize='14px' color="secondary" >{balance.owner?.address === account?.toLowerCase() ? t('You') : balance.owner?.name ?? truncateHash(balance.owner?.address)}</Text>
                    </Link>
                    </>
                ) : (
                    <>
                    <Users width="16px"/>
                    <Text fontSize='14px'ml="8px" mr="12px">{balance.owners} Owners</Text>
                    <ListViewIcon width="16px"/>
                    <Text fontSize='14px' ml="8px" mr="12px">{totalBalance} Total</Text>
                    {myBalance > 0 && (
                        <>
                        <User width="16px"/>
                        <Text fontSize='14px' ml="8px" mr="12px">You own {myBalance}</Text>
                        </>
                    )}
                    </>
                )}
            </Flex>
            )}
        </Flex>
    )
}

export default AssetHeader