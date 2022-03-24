import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useRefresh from 'hooks/useRefresh'
import AssetsFilter from '../../components/AssetsFilter'
import AssetsFilterWrapper from '../../components/AssetsFilter/AssetsFilterWrapper'
import SearchResult from './SearchResult'
import TopNav from './TopNav'
import {ItemSize} from './types'
import { getNftsWithQueryParams } from '../../hooks/useGetNFT'

const Wrapper = styled(Flex)`
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
    const [isFilterOpen, setFilterOpen] = useState(true)
    const [itemSize, setItemSize] = useState(ItemSize.LARGE)
    const [nfts, setNfts] = useState([])
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        const fetchNfts = async() => {
            try {
                const nfts_ = await getNftsWithQueryParams({})
                setNfts(nfts_)
            } catch {
                setNfts([])
            }
        }
            
        fetchNfts()
        
    }, [slowRefresh])
    
    return (
        <Wrapper>
            <AssetsFilterWrapper isOpen={isFilterOpen} />
            <AssetsFilter isOpen={isFilterOpen} onToggleOpen={() => setFilterOpen(!isFilterOpen)} />
            <Flex flexDirection="column">
                <TopNav itemSize={itemSize} onItemSizeChange={(size) => setItemSize(size)}/>
                <SearchResult isFilterOpen={isFilterOpen} itemSize={itemSize} items={nfts}/>
            </Flex>

            {/* {createPortal(<AssetsFilter isOpen={isFilterOpen} onToggleOpen={() => setFilterOpen(!isFilterOpen)} />, document.body)} */}
            

            {isMobile && !isFilterOpen && createPortal(<FilterButtonWrapper>
                    <Button onClick={() => setFilterOpen(true)}>
                        {t('Filter')}
                    </Button>
                </FilterButtonWrapper>, document.body)}
        </Wrapper>
    )
}

export default Assets