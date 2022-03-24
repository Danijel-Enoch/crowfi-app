import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { User, Users } from 'react-feather'
import { Flex, Text, Heading, CardViewIcon, ListViewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NFTAssetType } from 'state/types'
import truncateHash from 'utils/truncateHash'
import { BalanceResponse, NFTCollection, NFTMeta, NFTResponse } from '../../hooks/types'

interface AssetHeaderProps {
    metadata: NFTMeta
    collection?: NFTCollection
    nft?: NFTResponse
    balances?: BalanceResponse[]
    account?: string
}

const AssetHeader: React.FC<AssetHeaderProps> = ({metadata, collection, nft, balances, account}) => {

    const { t } = useTranslation()

    const assetUrl = useMemo(() => {
        if (metadata.properties?.type === NFTAssetType.Image) {
            return metadata.image
        }

        return metadata.animation_url

    }, [metadata])

    const filteredBalances = useMemo(() => {
        return balances.filter((item) => item.amount + item.change > 0)
    }, [balances])

    const totalBalance = useMemo(() => {
        return balances.reduce((accum, item) => {
            return accum + item.amount + item.change
        }, 0)
    }, [balances])

    const myBalance = useMemo(() =>  {
        return balances
        .filter((item) => item.user?.address === account?.toLowerCase())
        .reduce((accum, item) => {
            return accum + item.amount + item.change
        }, 0)
    }, [balances, account])

    
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
            { filteredBalances && filteredBalances.length > 0 && (
            <Flex alignItems="center">
                {filteredBalances.length === 1 ? (
                    <>
                    <Text fontSize='14px'mr="8px">Owned by </Text>
                    <Link to={`/nft/creator/${filteredBalances[0].user?.address}`}>
                        <Text fontSize='14px' color="secondary" >{filteredBalances[0].user?.address === account?.toLowerCase() ? t('You') : truncateHash(filteredBalances[0].user?.address)}</Text>
                    </Link>
                    </>
                ) : (
                    <>
                    <Users width="16px"/>
                    <Text fontSize='14px'ml="8px" mr="12px">{filteredBalances.length} Owners</Text>
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