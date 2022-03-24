import React, { useMemo, useEffect, useState } from 'react'
import { Button, Flex, Heading, LogoIcon, Spinner, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link, RouteComponentProps, Router, useParams } from 'react-router-dom'
import styled from 'styled-components'
import useRefresh from 'hooks/useRefresh'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { findNft, getNftBids, getNftsWithQueryParams, useGetActiveSaleForNFT, useGetNFTBalance, useGetNFTMeta } from '../../hooks/useGetNFT'
import { Auction, BalanceResponse, Listing, NFTCollection, NFTMeta, NFTResponse, BidResponse } from '../../hooks/types'
import AssetMedia from './AssetMedia'
import AssetInfoSection from './AssetInfoSection'
import AssetHeader from './AssetHeader'
import PriceHistorySection from './PriceHistorySection'
import ListingsSection from './ListingsSection'
import OffersSection from './OffersSection'
import ActivitySection from './ActivitySection'
import SimiliarSection from './SimiliarSection'
import { getCollectionsWithQueryParams } from '../../hooks/useCollections'
import OwnerBanner from './OwnerBanner'
import ActiveSaleSection from './ActiveSaleSection'
import ActiveListingSection from './ActiveListingSection'
import ActiveAuctionSection from './ActiveAuctionSection'


const BlankPage = styled.div`
    position:relative;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 540px);

    ${({ theme }) => theme.mediaQueries.sm} {
        padding-top: 32px;
        min-height: calc(100vh - 380px);
    }

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 32px;
        min-height: calc(100vh - 336px);
    }
`

const SpinnerWrapper = styled(Flex)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`
const FullWidthFlex = styled(Flex)`
    width: 100%;
`

const Asset: React.FC = () => {
    const { t } = useTranslation()
    const { address: contractAddress, assetId: tokenId } = useParams<{ address: string, assetId: string }>()
    const { account, chainId } = useWeb3React()
    const { slowRefresh } = useRefresh()
    const [needReload, setNeedReload] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [isValid, setIsValid] = useState(true)
    const [meta, setMeta] = useState<NFTMeta>(null)
    const [collection, setCollection] = useState<NFTCollection>(null)
    const [nft, setNft] = useState<NFTResponse>(null)
    const [listings, setListings] = useState<Listing[]>(null)
    const [auctions, setAuctions] = useState<Auction[]>(null)
    const [balances, setBalances] = useState<BalanceResponse[]>([])
    const [bids, setBids] = useState<BidResponse[]>([])
    const [similars, setSimilars] = useState<NFTResponse[]>(null)

    const activeAuctions = useMemo(() => {
        return auctions?.filter((item) => !item.isTaken)
    }, [auctions])

    const myBalance = useMemo(() =>  {
        return balances
        .filter((item) => item.user?.address === account?.toLowerCase())
        .reduce((accum, item) => {
            return accum + item.amount + item.change
        }, 0)
    }, [balances, account])

    const { onGetNFTAuction, onGetNFTSell } = useGetActiveSaleForNFT()

    const {onGetNFTMeta} = useGetNFTMeta()

    useEffect(() => {
        const fetchData = async() => {
            try {
                const {nft : nft_, balances: balances_} = await findNft(contractAddress, tokenId)
                if (!nft_) {
                    setIsValid(false)
                    setLoaded(true)
                    return
                }
                setNft(nft_)
                setBalances(balances_)
                setCollection(nft_.collection)

                const meta_ = await onGetNFTMeta(nft_.collection?.contract, nft_.tokenId)
                setMeta(meta_)


                const isValid_ = !!meta_;
                setIsValid(isValid_)

                onGetNFTAuction(nft_.contractAddress, nft_.tokenId).then((auctions_) => {
                    setAuctions(auctions_)
                })
                // setAuctions(auctions_)
                onGetNFTSell(nft_.contractAddress, nft_.tokenId).then((sells_) => {
                    setListings(sells_)
                })
                // setListings(sells_)

                getNftBids(nft_.id).then((bids_) => {
                    setBids(bids_)
                })

                getNftsWithQueryParams({collectionId: nft_.collection.id}).then((similars_) => {
                    console.log(similars_)
                    setSimilars(similars_.filter((item) => item.id !== nft_.id))
                })
            } catch (e) {
                console.log(e)
                setIsValid(false)
            }
            setLoaded(true)
            setNeedReload(false)
        }

        if (account) {
            fetchData()
        }
        
        
    }, [onGetNFTMeta, onGetNFTAuction, onGetNFTSell, account, needReload, slowRefresh, contractAddress, tokenId, chainId])

    const reloadSaleInfo = async () => {
        if (!nft) {
            return
        }

        const auctions_ = await onGetNFTAuction(nft.contractAddress, nft.tokenId)
        setAuctions(auctions_)
        const sells_ = await onGetNFTSell(nft.contractAddress, nft.tokenId)
        setListings(sells_)
        const bids_ = await getNftBids(nft.id)
        setBids(bids_)
    }

    const triggerReload = () =>  {
        if (needReload) {
            setNeedReload(false)
            setNeedReload(true)
        } else {
            setNeedReload(true)
        }
    }

    const renderContent = () =>  {
        return (
            <>
            { account && nft.owner?.toLowerCase() === account.toLowerCase() && myBalance > 0 && (
                <OwnerBanner nft={nft} account={account} onSell={() => reloadSaleInfo} balance={myBalance}/>
            )}
            <Container>

                <Flex flexDirection="column">

                    <Flex flexDirection={["column", null, null, "row"]}>
                        <Flex
                            flexDirection="column"
                            flex={["1", null, null, "3"]}
                        >
                            <AssetMedia metadata={meta} />
                            <AssetInfoSection metadata={meta} tokenAddress={nft.collection?.contract} tokenId={nft.tokenId} nft={nft}/>
                        </Flex>
                        <Flex
                            flexDirection="column"
                            flex={["1", null, null, "4"]}
                        >
                            <AssetHeader metadata={meta} collection={collection} nft={nft} account={account} balances={balances}/>
                            { activeAuctions && activeAuctions.map((auction) => {
                                return (
                                    <ActiveAuctionSection nft={nft} auction={auction} account={account} reloadSale={reloadSaleInfo}/>
                                )
                            })}
                            {/* <PriceHistorySection metadata={meta}/> */}
                            <ListingsSection metadata={meta} listings={listings} account={account} reloadSell={reloadSaleInfo}/>
                            <OffersSection metadata={meta} bids={bids} account={account}/>
                        </Flex>
                    </Flex>
                    <ActivitySection metadata={meta}/>
                    <SimiliarSection metadata={meta} items={similars}/>
                </Flex>
            </Container>
            </>
        )
    }
    
    return (
        <>
        { !account && (
            <BlankPage>
                <LogoIcon width="64px" mb="8px" />
                <Text mb="16px">{t('Please connect with your wallet.')}</Text>
                <ConnectWalletButton/>
            </BlankPage>
        )}
        { account && !loaded && (
            <BlankPage>
                <SpinnerWrapper >
                    <FullWidthFlex justifyContent="center" alignItems="center">
                        <Spinner />
                    </FullWidthFlex>
                </SpinnerWrapper>
            </BlankPage>
        )}
        { account && loaded && !isValid && (
            <BlankPage>
                <LogoIcon width="64px" mb="8px" />
                <Heading scale="xxl">404</Heading>
                <Text mb="16px">{t('Oops, page not found.')}</Text>
                <Button as={Link} to="/" scale="sm">
                {t('Back Home')}
                </Button>
            </BlankPage>
        )}

        { account && loaded && isValid && renderContent()}
        </>
    )
}

export default Asset