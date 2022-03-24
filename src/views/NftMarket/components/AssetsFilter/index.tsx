import React, { useRef, useEffect, useState } from 'react'
import { min, throttle } from 'lodash'
import { Button, CheckmarkIcon, Flex, HamburgerCloseIcon, HamburgerIcon, IconButton, InputGroup, SearchIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TruncatedText } from 'views/Swap/components/styleds'
import { NFTAssetType } from 'state/types'
import Select from 'components/Select/Select'
import { StyledTextInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import ExpandableSectionButton from '../ExpandableSectionButton'
import { NFTCollection, NFTFilterStatus } from '../../hooks/types'
import { getCollectionsWithQueryParams } from '../../hooks/useCollections'
import { Wrapper, Container, OptionButton, ExpandingWrapper} from './controls'
import { AssetArtTypeFilter, AssetFilter, AssetStatusFilter, AssetPriceFilter, createFilterFrom } from './types'

interface AssetsFilterPanelProps {
    isOpen: boolean
    selectedCollections: Map<number, NFTCollection>
    artType: AssetArtTypeFilter
    status: AssetStatusFilter
    setSelectedCollections: (collections: Map<number, NFTCollection>) => void
    setArtType: (artType: AssetArtTypeFilter) => void
    setStatus: (status: AssetStatusFilter) => void
    setPriceFilter: (priceFilter: AssetPriceFilter) => void
    onToggleOpen: () => void
    onFilterChanged?: (filter: AssetFilter) => void
}

const AssetsFilterPanel: React.FC<AssetsFilterPanelProps> = ({
    isOpen, 
    selectedCollections,
    artType,
    status,
    setSelectedCollections,
    setArtType,
    setStatus,
    setPriceFilter,
    onToggleOpen, 
    onFilterChanged
}) => {

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints();
    const [showMenu, setShowMenu] = useState(true);
    const [isStatusOpen, setStatusOpen] = useState(true)
    const [isArtTypeOpen, setArtTypeOpen] = useState(true)
    const [isPriceOpen, setPriceOpen] = useState(true)
    const [isCollectionOpen, setCollectionOpen] = useState(true)
    const [priceMin, setPriceMin] = useState('')
    const [priceMax, setPriceMax] = useState('')
    const [useEth, setUseEth] = useState(true)
    const [topOffset, setTopOffset] = useState(0)
    const [heightOffset, setHeightOffset] = useState(132)

    const [collectionName, setCollectionName] = useState('')
    const [collections, setCollections] = useState<NFTCollection[]>([])
    const refPrevOffset = useRef(window.pageYOffset);

    const bottomBarHeight = isMobile ? 50 : 0;
    useEffect(() => {
        const handleScroll = () => {
            const currentOffset = window.pageYOffset;
            const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
            const isTopOfPage = currentOffset === 0;
            // Always show the menu when user reach the top
            if (isTopOfPage) {
                setShowMenu(true);
                setTopOffset(0)
                setHeightOffset(132 + bottomBarHeight)
            }
            else if (currentOffset <= 90) {
                // Has scroll up
                setShowMenu(true)
                setTopOffset(Math.max(currentOffset - 132, 0))
                setHeightOffset(132 - currentOffset)
            } else if (currentOffset < refPrevOffset.current) {
                // Has scroll up
                setShowMenu(true)
                setTopOffset(Math.max(currentOffset - 132, 0) + 90)
                setHeightOffset(90 + bottomBarHeight)
            } else {
                // Has scroll down
                setShowMenu(false);
                setTopOffset(Math.max(currentOffset - 132, 0))
                setHeightOffset(bottomBarHeight)
            }
            refPrevOffset.current = currentOffset;
        };
        const throttledHandleScroll = throttle(handleScroll, 200);
    
        window.addEventListener("scroll", throttledHandleScroll);
        return () => {
          window.removeEventListener("scroll", throttledHandleScroll);
        };
      }, [bottomBarHeight]);
    
    useEffect(() => {
        const fetchCollections = async () => {
            const collections_ = await getCollectionsWithQueryParams({'query[name]': collectionName})
            setCollections(collections_)
        }

        fetchCollections()
    }, [collectionName])

    const handleToggleStatus = (key: string) => {
        const status_ = {...status}
        status_[key] = !status[key]
        setStatus(status_)
    }

    const handleToggleArtType = (key: string) => {
        const type_ = {...artType}
        type_[key] = !artType[key]
        setArtType(type_)
    }

    const handleToogleCollection = (collection: NFTCollection) => {
        const selected = new Map(selectedCollections.set(collection.id, selectedCollections.get(collection.id) ? null : collection))
        setSelectedCollections(selected)
    }

    const handlePriceApply = () => {
        if (parseFloat(priceMin) >= 0 && parseFloat(priceMin) <= parseFloat(priceMax) ) {
            const priceFilter_ = {min:parseFloat(priceMin), max: parseFloat(priceMax), eth: useEth}
            setPriceFilter(priceFilter_)
        }
    }

    return (
        <Wrapper flexDirection="column" isOpen={isOpen} topOffset={topOffset} heightOffset={heightOffset}>
            <Flex alignItems="center" justifyContent="space-between">
                {isOpen && (
                <Text color="primary" bold padding="8px 16px">
                    {t('Filter')}
                </Text>
                )}
                <IconButton variant="text" onClick={onToggleOpen} >
                    { isOpen ? (
                        <HamburgerCloseIcon width="32px" color="primary"/>  
                    ) : (
                        <HamburgerIcon width="32px" color="primary"/>
                    )}
                </IconButton>
            </Flex>
            <Container isOpen={isOpen}>
                <ExpandingWrapper>
                    <ExpandableSectionButton
                    onClick={() => setStatusOpen(!isStatusOpen)}
                    expanded={isStatusOpen}
                    title={t('Status')}
                    />
                    {isStatusOpen && (
                    <Flex flexWrap="wrap" padding="8px">
                        <Flex padding="8px" width="50%">
                            <OptionButton 
                            variant={!status.buyNow ? "secondary" : "primary"}
                            onClick={() => handleToggleStatus('buyNow')}
                            >
                                {t('Buy Now')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton
                            variant={!status.minted ? "secondary" : "primary"}
                            onClick={() => handleToggleStatus('minted')}>
                                {t('Minted')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton
                            variant={!status.onAuction ? "secondary" : "primary"}
                            onClick={() => handleToggleStatus('onAuction')}>
                                {t('On Auction')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton
                            variant={!status.hasOffer ? "secondary" : "primary"}
                            onClick={() => handleToggleStatus('hasOffer')}>
                                {t('Has Offer')}
                            </OptionButton>
                        </Flex>
                    </Flex>
                    )}
                </ExpandingWrapper>
                <ExpandingWrapper>
                    <ExpandableSectionButton
                    onClick={() => setArtTypeOpen(!isArtTypeOpen)}
                    expanded={isArtTypeOpen}
                    title={t('Art Type')}
                    />
                    {isArtTypeOpen && (
                    <Flex flexWrap="wrap" padding="8px">
                        <Flex padding="8px" width="50%">
                            <OptionButton
                            variant={artType.image ? "primary" : "secondary"}
                            onClick={() => handleToggleArtType(NFTAssetType.Image)}>
                                {t('Image')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton
                            variant={artType.video ? "primary" : "secondary"}
                            onClick={() => handleToggleArtType(NFTAssetType.Video)}>
                                {t('Video')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton
                            variant={artType.audio ? "primary" : "secondary"}
                            onClick={() => handleToggleArtType(NFTAssetType.Audio)}>
                                {t('Audio')}
                            </OptionButton>
                        </Flex>
                    </Flex>
                    )}
                </ExpandingWrapper>
                <ExpandingWrapper>
                    <ExpandableSectionButton
                    onClick={() => setCollectionOpen(!isCollectionOpen)}
                    expanded={isCollectionOpen}
                    title={t('Collections')}
                    />
                    {isCollectionOpen && (
                    <Flex flexDirection="column">
                        <Flex padding="16px">
                            <InputGroup startIcon={<SearchIcon width="18px"/>}>
                                <StyledTextInput
                                    placeholder={t('Filter')}
                                    value={collectionName}
                                    onUserInput={(val) => setCollectionName(val)}
                                />
                            </InputGroup>
                        </Flex>
                        {collections.map((collection) => {
                            return (
                                <Flex padding="4px 16px" 
                                style={{cursor: "pointer"}}
                                key={collection.id}
                                onClick={() => {
                                    handleToogleCollection(collection)
                                }}
                                >
                                    <Flex width="20px" height="20px" mr="8px">
                                        <img alt={collection.name} src={collection.logo}/>
                                    </Flex>
                                    <Flex flex="1">
                                        <TruncatedText>
                                            {collection.name}
                                        </TruncatedText>
                                    </Flex>
                                    <Flex width="20px">
                                        {
                                            selectedCollections.get(collection.id) && (
                                                <CheckmarkIcon width="20px" height="20px" color="primary"/>
                                            )
                                        }
                                        
                                    </Flex>
                                </Flex>
                            )
                        })}
                    </Flex>
                    )}
                </ExpandingWrapper>

                <ExpandingWrapper>
                    <ExpandableSectionButton
                    onClick={() => setPriceOpen(!isPriceOpen)}
                    expanded={isPriceOpen}
                    title={t('Price')}
                    />
                    {isPriceOpen && (
                    <Flex flexDirection="column">
                        <Flex margin="16px 16px 4px 16px">
                            <Select
                                options={[{
                                    label: t('United States Dollar(USD)'),
                                    value: false
                                }, {
                                    label: t('Cronos(CRO)'),
                                    value: true
                                }]}
                                defaultOptionIndex={1}
                                onOptionChange={(option) => setUseEth(option.value)}
                            />
                        </Flex>
                        <Flex padding="8px" alignItems="center">
                            <Flex padding="8px" flex="1">
                                <StyledNumericalInput placeholder={t('Min')} value={priceMin} onUserInput={(val) => setPriceMin(val)}/>
                            </Flex>
                            <Text fontSize="14px">
                                {t('to')}
                            </Text>
                            <Flex padding="8px" flex="1">
                                <StyledNumericalInput placeholder={t('Max')} value={priceMax} onUserInput={(val) => setPriceMax(val)}/>
                            </Flex>
                        </Flex>
                        <Flex padding="0px 16px 16px" flexDirection="column">
                            <Button onClick={handlePriceApply}>
                                {t('Apply')}
                            </Button>
                        </Flex>
                    </Flex>
                    )}
                </ExpandingWrapper>
            </Container>
        </Wrapper>
    )
}

export default AssetsFilterPanel