import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { NFTAssetType } from 'state/types'
import { usePriceBnbBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import AssetsFilterPanel from '../../components/AssetsFilter'
import AssetsFilterWrapper from '../../components/AssetsFilter/AssetsFilterWrapper'
import SearchResult from './SearchResult'
import TopNav, { AssetSortOption } from './TopNav'
import {ItemSize} from './types'
import { getNftsWithQueryParams } from '../../hooks/useGetNFT'
import { AssetArtTypeFilter, AssetFilter, AssetStatusFilter, AssetPriceFilter } from '../../components/AssetsFilter/types'
import FilterStatusSection from './FilterStatusSection'
import { NFTCollection } from '../../hooks/types'

const Wrapper = styled(Flex).attrs({flex: 1})`
    background-color: white;
`

const FilterButtonWrapper = styled.div`
    position: fixed;
    bottom: 60px;
    z-index: 999;
    width: 120px;
    height: 60px;
    left: calc(50% - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
`

const Assets: React.FC = () => {

    const { isMobile } = useMatchBreakpoints()
    const { t } = useTranslation()
    const { observerRef, isIntersecting } = useIntersectionObserver()
    const [isFilterOpen, setFilterOpen] = useState(true)
    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [itemSize, setItemSize] = useState(ItemSize.LARGE)
    const [nfts, setNfts] = useState([])
    const [totalItemCount, setTotalItemCount] = useState(0)
    const nftCount = useRef(0)
    const [sortOption, setSortOption] = useState<AssetSortOption>(AssetSortOption.CREATED)
    const [assetFilter, setAssetFilter] = useState<AssetFilter>(null)
    const { slowRefresh } = useRefresh()
    const pageSize = 10
    const [loading, setLoading] = useState(0)
    const lastParams = useRef('')
    const [numberOfItemsToLoad, setNumberOfItemsToLoad] = useState(pageSize)

    const [artType, setArtType] = useState<AssetArtTypeFilter>({
        image: false,
        video: false,
        audio: false
    })
    const [status, setStatus] = useState<AssetStatusFilter>({
        buyNow: false,
        minted: false,
        hasOffer: false,
        onAuction: false,
    })
    const [priceFilter, setPriceFilter] = useState<AssetPriceFilter>(null)
    const [selectedCollections, setSelectedCollections] = useState(new Map<number, NFTCollection>())
    const [collectionName, setCollectionName] = useState('')

    const ethPrice = usePriceBnbBusd()

    const isFilterNotEmpty = useMemo(() => {
        return selectedCollections.size > 0 || !!priceFilter || artType.image || artType.video || artType.audio || status.buyNow || status.minted || status.hasOffer || status.onAuction
    }, [selectedCollections, priceFilter, artType, status])

    useEffect(() => {
        if (isIntersecting) {
            setNumberOfItemsToLoad((currentNumber) => {
                if (currentNumber < totalItemCount) {
                    return Math.min(totalItemCount, currentNumber + pageSize)
                }
                return currentNumber
            })
        }
    }, [isIntersecting, totalItemCount])


    useEffect(() => {
        const reloadNfts = async () => {
            try {
                setLoading((currentLoading) => {
                    return currentLoading + 1
                })
                
                const params = {}
                let typeIndex = 0;
                let statusIndex = 0;
                if (artType.image) params[`query[mediaType][${typeIndex++}]`] = NFTAssetType.Image
                if (artType.video) params[`query[mediaType][${typeIndex++}]`] = NFTAssetType.Video
                if (artType.audio) params[`query[mediaType][${typeIndex++}]`] = NFTAssetType.Audio
                if (status.buyNow) params[`query[status][${statusIndex++}]`] = 'buy_now'
                if (status.minted) params[`query[status][${statusIndex++}]`] = 'minted'
                if (status.onAuction) params[`query[status][${statusIndex++}]`] = 'on_auction'
                if (status.hasOffer) params[`query[status][${statusIndex++}]`] = 'has_offer'
                let colIndex = 0
                if (selectedCollections) {
                    selectedCollections.forEach((value, key) => {
                        if (value) {
                            params[`query[collections][${colIndex++}]`] = value.id
                        }
                    })
                }
                if (priceFilter) {
                    params[`query[price][min]`] = priceFilter.min
                    params[`query[price][max]`] = priceFilter.max
                    params[`query[price][eth]`] = priceFilter.eth
                    params[`query[price][eth_price]`] = ethPrice ? parseFloat(ethPrice.toFixed(6)) : 1
                }

                switch(sortOption) {
                    case AssetSortOption.CREATED:
                        params[`query[sortBy]`] = 'createdAt'
                        params[`query[sortAscending]`] = 'DESC'
                        break
                    case AssetSortOption.LISTED:
                        params[`query[sortBy]`] = 'listedAt'
                        params[`query[sortAscending]`] = 'DESC'
                        break
                    case AssetSortOption.SOLD:
                        params[`query[sortBy]`] = 'soldAt'
                        params[`query[sortAscending]`] = 'DESC'
                        break
                    case AssetSortOption.PRICE_ASC:
                        params[`query[sortBy]`] = 'currentPrice'
                        params[`query[sortAscending]`] = 'ASC'
                        break
                    case AssetSortOption.PRICE_DESC:
                        params[`query[sortBy]`] = 'currentPrice'
                        params[`query[sortAscending]`] = 'DESC'
                        break
                    case AssetSortOption.OLDEST:
                        params[`query[sortBy]`] = 'createdAt'
                        params[`query[sortAscending]`] = 'ASC'
                        break
                    default:
                        break
                }
                const lastParams_ = JSON.stringify(params)
                if (lastParams.current !== lastParams_) {
                    const {rows, count} = await getNftsWithQueryParams({...params, offset: 0, limit: pageSize})
                    setNfts(rows)
                    setTotalItemCount(count)
                    setNumberOfItemsToLoad(pageSize)
                    lastParams.current = lastParams_
                    nftCount.current = rows.length
                } else if (numberOfItemsToLoad > nftCount.current){
                    // load More
                    const {rows, count} = await getNftsWithQueryParams({...params, offset: nftCount.current, limit: numberOfItemsToLoad - nftCount.current})
                    setTotalItemCount(count)
                    setNfts((current) => {
                        nftCount.current = current.length + rows.length
                        return [...current, ...rows]
                    })
                }
            } catch {
                lastParams.current = ''
                setNfts([])
                setTotalItemCount(0)
            } finally {
                setLoading((currentLoading) => {
                    return currentLoading -1
                })
            }
        }

        reloadNfts()
    }, [slowRefresh, selectedCollections, priceFilter, artType, status, ethPrice, sortOption, numberOfItemsToLoad])
    
    return (
        <Wrapper>
            <AssetsFilterWrapper isOpen={isMobile ? isMobileFilterOpen : isFilterOpen} />
            <AssetsFilterPanel 
                isOpen={isMobile ? isMobileFilterOpen : isFilterOpen} 
                onToggleOpen={() => isMobile ? setMobileFilterOpen(!isMobileFilterOpen) : setFilterOpen(!isFilterOpen)} 
                onFilterChanged={(filter) => setAssetFilter(filter)}
                status={status}
                artType={artType}
                selectedCollections={selectedCollections}
                setStatus={setStatus}
                setArtType={setArtType}
                setSelectedCollections={setSelectedCollections}
                setPriceFilter={setPriceFilter}
            />
            <Flex flexDirection="column" flex="1">
                <TopNav 
                    itemCount={totalItemCount} 
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    itemSize={itemSize} 
                    onItemSizeChange={(size) => setItemSize(size)}
                    loading={loading > 0}
                    />
                <FilterStatusSection 
                    priceFilter={priceFilter} 
                    selectedCollections={selectedCollections}
                    isFilterNotEmpty={isFilterNotEmpty}
                    resetPrice={() => setPriceFilter(null)}
                    clearFilter={() => {
                        setPriceFilter(null)
                        setArtType({image: false, video: false, audio: false})
                        setStatus({minted: false, buyNow: false, onAuction: false, hasOffer: false})
                        setCollectionName('')
                        setSelectedCollections(new Map<number, NFTCollection>())
                    }}
                />
                <SearchResult isFilterOpen={isFilterOpen} itemSize={itemSize} items={nfts}/>
                <div ref={observerRef}/>
            </Flex>

            {/* {createPortal(<AssetsFilter isOpen={isFilterOpen} onToggleOpen={() => setFilterOpen(!isFilterOpen)} />, document.body)} */}
            

            {isMobile && !isMobileFilterOpen && createPortal(<FilterButtonWrapper>
                    <Button onClick={() => setMobileFilterOpen(true)}>
                        {t('Filter')}
                    </Button>
                </FilterButtonWrapper>, document.body)}
        </Wrapper>
    )
}

export default Assets