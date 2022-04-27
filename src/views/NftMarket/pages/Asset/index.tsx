import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button, Flex, Heading, LogoIcon, Overlay, Spinner, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link, RouteComponentProps, Router, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { NFTContractType } from 'state/types'
import useRefresh from 'hooks/useRefresh'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { findNft, getNftActivities, getNftBids, getNftsWithQueryParams, useGetActiveSaleForNFT, useGetNFT, useGetNFTBalance } from '../../hooks/useGetNFT'
import { Auction, BalanceResponse, Listing, NFTCollection, NFTMeta, NFTResponse, BidResponse, ActivitiesAPIResponse, NFTBalanceResponse, NFTAsset, NFTAssetRegistrationStatus, BundleItem } from '../../hooks/types'
import AssetMedia from './AssetMedia'
import AssetInfoSection from './AssetInfoSection'
import AssetHeader from './AssetHeader'
import ListingsSection from './ListingsSection'
import ActivitySection from './ActivitySection'
import SimiliarSection from './SimiliarSection'
import OwnerBanner from './OwnerBanner'
import ActiveAuctionSection from './ActiveAuctionSection'
import MediaViewer from './MediaViewer'
import ImportBanner from './ImportBanner'
import { useFavoriteNFT } from '../../hooks/useFavoriteNFT'
import { useGetBundleItems } from '../../hooks/useBundle'
import BundleItemsSection from './BunldeItemsSection'
import BidsSection from './BidsSection'
import OffersSection from './OffersSection'
import ActiveListingSection from './ActiveListingSection'
import AuctionsSection from './AuctionsSection'


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
    const [mediaViewerVisible, setMediaViewerVisible] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [isValid, setIsValid] = useState(true)
    const [registrationStatus, setRegistrationStatus] = useState<NFTAssetRegistrationStatus>(NFTAssetRegistrationStatus.UNKNOWN)
    const [asset, setAsset] = useState<NFTAsset>(null)
    const [meta, setMeta] = useState<NFTMeta>(null)
    const [collection, setCollection] = useState<NFTCollection>(null)
    const [nft, setNft] = useState<NFTResponse>(null)
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [activeListing, setActiveListing] = useState<Listing>(null)
    const [listings, setListings] = useState<Listing[]>(null)
    const [activeAuction, setActiveAuction] = useState<Auction>(null)
    const [auctions, setAuctions] = useState<Auction[]>(null)
    const [offers, setOffers] = useState<Listing[]>(null)
    const [balance, setBalance] = useState<NFTBalanceResponse>(null)
    const [bids, setBids] = useState<BidResponse[]>([])
    const [similars, setSimilars] = useState<NFTResponse[]>(null)
    const [activities, setActivities] = useState<ActivitiesAPIResponse>({rows: [], count: 0})
    const [bundleItems, setBundleItems] = useState<BundleItem[]>()
    const {onFavoriteNFT, onUnfavoriteNFT} = useFavoriteNFT(contractAddress, tokenId)

    // const activeAuctions = useMemo(() => {
    //     return auctions?.filter((item) => !item.isTaken)
    // }, [auctions])

    const activeListings = useMemo(() => {
        return listings?.filter((item) => !item.isSold)
    }, [listings])

    const myBalance = useMemo(() =>  {
        return balance ?  balance.balance : 0;
    }, [balance])

    const isCreator = useMemo(() => {
        return nft?.creator?.address?.toLowerCase() === account?.toLowerCase()
    }, [nft, account])

    const { onGetNFTAuction, onGetNFTSell, onGetNFTOffer } = useGetActiveSaleForNFT()

    const {onGetNFT} = useGetNFT()
    const {onGetBundleItems} = useGetBundleItems()

    useEffect(() => {
        setLoaded(false)
        setNft(null)
        setBalance(null)
        setCollection(null)
        setMeta(null)
        setListings([])
        setActiveListing(null)
        setAuctions([])
        setActiveAuction(null)
        setBids([])
        setActivities({rows: [], count: 0})
    }, [contractAddress, tokenId])

    useEffect(() => {
        const fetchData = async() => {
            try {
                const {asset:asset_, meta: meta_} = await onGetNFT(contractAddress, tokenId)
                if (!asset_ || !meta_) {
                    setIsValid(false)
                    setLoaded(true)
                    return
                }

                setRegistrationStatus(NFTAssetRegistrationStatus.UNKNOWN)

                setAsset(asset_)
                setMeta(meta_)
                setIsValid(true)

                if (asset_.contractType === NFTContractType.BUNDLE) {
                    onGetBundleItems(contractAddress, tokenId).then((val) => {
                        setBundleItems(val)
                    })
                }

                findNft(contractAddress, tokenId, account).then((val) => {
                    if (val && val.nft) {
                        const nft_ = val.nft
                        const balance_ = val.balance
                        setNft(nft_)
                        setBalance(balance_)
                        setCollection(nft_.collection)
                        setLikes(val.likes)
                        setLiked(val.liked)
                        setRegistrationStatus(NFTAssetRegistrationStatus.REGISTERED)

                        getNftBids(nft_.id).then((bids_) => {
                            setBids(bids_)
                        })

                        if (nft_.collection) {
                            getNftsWithQueryParams({collectionId: nft_.collection.id}).then((res) => {
                                setSimilars(res.rows.filter((item) => item.id !== nft_.id))
                            })
                        }
        
                        getNftActivities(nft_.id).then((res) => {
                            setActivities(res)
                        })
                    } else {
                        setRegistrationStatus(NFTAssetRegistrationStatus.NOT_REGISTERED)
                    }
                })

                onGetNFTAuction(asset_.contractAddress, asset_.tokenId).then((auctions_) => {
                    const remainingAuctions: Auction[] = []
                    let foundActiveAuction = false
                    auctions_.forEach(function(auction) {
                        if (foundActiveAuction || auction.isTaken) {
                            remainingAuctions.push(auction)
                        } else {
                            setActiveAuction(auction)
                            foundActiveAuction = true
                        }
                    })
                    setAuctions(remainingAuctions)
                })
                // setAuctions(auctions_)
                onGetNFTSell(asset_.contractAddress, asset_.tokenId).then((sells_) => {
                    const remainingSells: Listing[] = []
                    let foundActiveSell = false
                    sells_.forEach(function(sell) {
                        if (foundActiveSell || sell.isSold) {
                            remainingSells.push(sell)
                        } else {
                            setActiveListing(sell)
                            foundActiveSell = true
                        }
                    })
                    setListings(remainingSells)
                })
                onGetNFTOffer(asset_.contractAddress, asset_.tokenId).then((offers_) => {
                    setOffers(offers_)
                })
                // setListings(sells_)
            } catch {
                setIsValid(false)
            }
            setLoaded(true)
            setNeedReload(false)
        }

        if (account) {
            fetchData()
        }
        
        
    }, [onGetNFT, onGetNFTAuction, onGetNFTSell, onGetNFTOffer, onGetBundleItems, account, needReload, slowRefresh, contractAddress, tokenId, chainId])

    const reloadSaleInfo = async () => {
        if (!nft) {
            return
        }

        const auctions_ = await onGetNFTAuction(nft.contractAddress, nft.tokenId)
        const remainingAuctions: Auction[] = []
        let foundActiveAuction = false
        auctions_.forEach(function(auction) {
            if (foundActiveAuction || auction.isTaken) {
                remainingAuctions.push(auction)
            } else {
                setActiveAuction(auction)
                foundActiveAuction = true
            }
        })
        setAuctions(remainingAuctions)
        
        const sells_ = await onGetNFTSell(nft.contractAddress, nft.tokenId)
        const remaingSells: Listing[] = []
        let foundActiveSell = false
        sells_.forEach(function(sell) {
            if (foundActiveSell || sell.isSold) {
                remaingSells.push(sell)
            } else {
                setActiveListing(sell)
                foundActiveSell = true
            }
        })
        setListings(remaingSells)
        const offers_ = await onGetNFTOffer(nft.contractAddress, nft.tokenId)
        setOffers(offers_)
        const bids_ = await getNftBids(nft.id)
        setBids(bids_)
        if (nft.collection) {
            const similars_ = await getNftsWithQueryParams({collectionId: nft.collection.id})
            setSimilars(similars_.rows)
        }

        const activities_ = await getNftActivities(nft.id)
        setActivities(activities_)
    }



    const handleToggleFavorite = useCallback(async () => {
        
        if (!liked) {
            const {likes: likes_, liked: liked_}  = await onFavoriteNFT()
            setLikes(likes_)
            setLiked(liked_)
        } else {

            const {likes: likes_, liked: liked_}  = await onUnfavoriteNFT()
            setLikes(likes_)
            setLiked(liked_)
        }
    }, [liked, onFavoriteNFT, onUnfavoriteNFT])

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
            { account && registrationStatus === NFTAssetRegistrationStatus.NOT_REGISTERED && (
                <ImportBanner asset={asset} account={account}/>
            )}
            { nft && account && myBalance > 0 && (
                <OwnerBanner nft={nft} account={account} onSell={() => reloadSaleInfo} balance={myBalance}/>
            )}
            <Container>

                <Flex flexDirection="column">

                    <Flex flexDirection={["column", null, null, "row"]}>
                        <Flex
                            flexDirection="column"
                            flex={["1", null, null, "3"]}
                        >
                            <AssetMedia metadata={meta} onMediaClick={() => setMediaViewerVisible(true)} likes={likes} liked={liked} onToggleFavorite={handleToggleFavorite}/>
                            <AssetInfoSection metadata={meta} collection={collection} asset={asset} balance={balance}/>
                        </Flex>
                        <Flex
                            flexDirection="column"
                            flex={["1", null, null, "4"]}
                        >
                            <AssetHeader metadata={meta} collection={collection} account={account} balance={balance}/>
                            { activeAuction && (
                                <ActiveAuctionSection key={activeAuction.id} nft={nft} auction={activeAuction} account={account} reloadSale={reloadSaleInfo}/>
                            )}
                            { activeListing && (
                                <ActiveListingSection key={activeListing.id} nft={nft} sell={activeListing} account={account} reloadSell={reloadSaleInfo}/>
                            )}
                            {/* <PriceHistorySection metadata={meta}/> */}
                            <AuctionsSection metadata={meta} auctions={auctions} account={account} reloadSell={reloadSaleInfo}/>
                            <ListingsSection metadata={meta} listings={listings} account={account} reloadSell={reloadSaleInfo}/>
                            <OffersSection metadata={meta} offers={offers} account={account} reloadSell={reloadSaleInfo} myBalance={myBalance}/>
                            <BidsSection metadata={meta} bids={bids} account={account}/>
                        </Flex>
                    </Flex>
                    {asset.contractType === NFTContractType.BUNDLE && (
                        <BundleItemsSection items={bundleItems}/>
                    )}
                    <ActivitySection metadata={meta} activities={activities} account={account} nft={nft}/>
                    {asset.contractType !== NFTContractType.BUNDLE && (
                    <SimiliarSection metadata={meta} items={similars}/>
                    )}
                </Flex>

                {mediaViewerVisible && createPortal(
                    <MediaViewer metadata={meta} onDismiss={() => setMediaViewerVisible(false)}/>
                , document.body)}
                
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