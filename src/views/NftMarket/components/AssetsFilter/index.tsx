import React, { useRef, useEffect, useState } from 'react'
import { min, throttle } from 'lodash'
import { Button, Flex, HamburgerCloseIcon, HamburgerIcon, IconButton, InputGroup, SearchIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { StyledInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import ExpandableSectionButton from '../ExpandableSectionButton'

const Wrapper = styled(Flex)<{isOpen: boolean, topOffset: number, heightOffset: number}>`
    transition: top .3s;
    max-width: 100%;
    width: ${({ isOpen }) => isOpen ? '320px' : '0px'};
    min-width: ${({ isOpen }) => isOpen ? '320px' : '0px'};
    overflow: hidden;
    overflow-y: scroll;
    border-right: 1px solid ${({ theme }) => theme.colors.cardBorder};
    background-color: white;
    padding-bottom: 20px;

    position: fixed;
    top: ${({ topOffset }) => `${topOffset}px`};
    left: 0;
    height: ${({ heightOffset }) => `calc(100vh - ${heightOffset}px)`};
    z-index: 999;
    transform: translate3d(0, 0, 0);

    ${({ theme }) => theme.mediaQueries.sm} {
        width: ${({ isOpen }) => isOpen ? '320px' : '50px'};
        min-width: ${({ isOpen }) => isOpen ? '320px' : '50px'};
    }
`

const Container = styled.div<{isOpen: boolean}>`
    display: flex;
    flex-direction: column;
    width: 320px;
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
`

const ExpandingWrapper = styled.div`
    display:flex;
    flex-direction: column;
    overflow: hidden;
`

const OptionButton = styled(Button)`
    flex: 1;
    font-size: 14px;
`

interface AssetsFilterProps {
    isOpen: boolean
    onToggleOpen: () => void
}

const AssetsFilter: React.FC<AssetsFilterProps> = ({isOpen, onToggleOpen}) => {

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints();
    const [showMenu, setShowMenu] = useState(true);
    const [isStatusOpen, setStatusOpen] = useState(true)
    const [isArtTypeOpen, setArtTypeOpen] = useState(true)
    const [isPriceOpen, setPriceOpen] = useState(true)
    const [isCollectionOpen, setCollectionOpen] = useState(true)
    const [priceMin, setPriceMin] = useState('')
    const [priceMax, setPriceMax] = useState('')
    const [topOffset, setTopOffset] = useState(0)
    const [heightOffset, setHeightOffset] = useState(132)
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
                            <OptionButton variant="secondary">
                                {t('Buy Now')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton variant="secondary">
                                {t('Minted')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton  variant="secondary">
                                {t('On Auction')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton variant="secondary">
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
                            <OptionButton variant="secondary">
                                {t('Image')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton variant="secondary">
                                {t('Video')}
                            </OptionButton>
                        </Flex>
                        <Flex padding="8px" width="50%">
                            <OptionButton  variant="secondary">
                                {t('Music')}
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
                                <StyledInput placeholder={t('Filter')}/>
                            </InputGroup>
                        </Flex>
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
                            <Button>
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

export default AssetsFilter