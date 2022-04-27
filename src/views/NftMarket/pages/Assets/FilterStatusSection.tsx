import React, { useMemo, useState } from 'react'
import { Button, CloseIcon, Flex, Text } from '@pancakeswap/uikit'
import { ETHER } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { TokenImage } from 'components/TokenImage'
import { CurrencyLogo } from 'components/Logo'
import { AssetFilter, AssetPriceFilter } from '../../components/AssetsFilter/types'
import { NFTCollection } from '../../hooks/types'

const ItemWrapper = styled.div`
    cursor:pointer;
    display: flex;
    margin: 8px;
    border-radius: ${({ theme }) => theme.radii.card};
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.backgroundAlt};

    &:hover {
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
    }
`

const Label = styled(Text)`
    white-space:nowrap;
`

const ClearButton = styled(Button).attrs({variant: 'text'})`
    padding: 0px 24px;
    margin: 8px 0px;
    height: 42px;
    font-size: 14px;
`

interface FilterStatusSectionProps {
    isFilterNotEmpty?: boolean
    priceFilter?: AssetPriceFilter
    selectedCollections: Map<number, NFTCollection>
    clearFilter?: () => void
    resetPrice?: () => void
    deselectCollection?: (collection: NFTCollection) => void
}

const FilterStatusSection: React.FC<FilterStatusSectionProps> = ({
    isFilterNotEmpty,
    priceFilter, 
    selectedCollections,
    clearFilter,
    resetPrice, 
    deselectCollection
}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()

    const collections = useMemo(() => {
        const items = []
        selectedCollections.forEach((item,) => {
            if (item) {
                items.push(item)
            }
        })
        return items
    }, [selectedCollections])

    return (
        <Flex flexWrap="wrap">
            {priceFilter && (
                <ItemWrapper onClick={resetPrice ?? resetPrice}>
                    <Flex width="24px" height="24px" mr="12px">
                    {priceFilter.eth ? (
                        <CurrencyLogo currency={ETHER} />
                    ) : (
                        <TokenImage token={tokens.usdc} width={24} height={24} />
                    )}
                    </Flex>
                    <Label mr="12px">{priceFilter.min} - {priceFilter.max}</Label>
                    <CloseIcon width="14px"/>
                </ItemWrapper>
            )}

            {collections.map((collection) => {
                return (
                <ItemWrapper onClick={resetPrice ?? resetPrice} key={collection.id}>
                    <Flex width="24px" height="24px" mr="12px">
                        <img alt={collection.name} src={collection.logo}/>
                    </Flex>
                    <Label mr="12px">{collection.name}</Label>
                    <CloseIcon width="14px"/>
                </ItemWrapper>
                )
            })}

            {isFilterNotEmpty && (
                <ClearButton onClick={clearFilter}>
                    {t('Clear All')}
                </ClearButton>
            )}

        </Flex>
    )
}

export default FilterStatusSection