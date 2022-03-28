import React, { useMemo, useState } from 'react'
import { Box, ButtonMenu, ButtonMenuItem, Flex, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import BoxButtonMenu from 'components/BoxButtonMenu'
import Select from 'components/Select/Select'
import { ItemSize } from './types'

const SortSelect = styled(Select)`
    width: 300px;
`;

export enum AssetSortOption {
    LISTED,
    CREATED,
    SOLD,
    PRICE_ASC,
    PRICE_DESC,
    OLDEST,
}

interface TopNavProps {
    itemCount?: number
    itemSize: ItemSize
    sortOption: AssetSortOption
    setSortOption: (option: AssetSortOption) => void
    onItemSizeChange: (itemSize) => void
}

const TopNav: React.FC<TopNavProps> = ({itemCount, itemSize, setSortOption, onItemSizeChange}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()

    const sortOptions = [
        { label: t('Recently Created'), value: AssetSortOption.CREATED },
        { label: t('Recently Listed'), value: AssetSortOption.LISTED },
        { label: t('Recently Sold'), value: AssetSortOption.SOLD },
        { label: t('Price: Low to High'), value: AssetSortOption.PRICE_ASC },
        { label: t('Price: High to Low'), value: AssetSortOption.PRICE_DESC },
        { label: t('Oldest'), value: AssetSortOption.OLDEST },
    ]

    const [activeButtonIndex, setActiveButtonIndex] = useState(0)

  const onMenuItemClick = (index: number) => {
    setActiveButtonIndex(index)
  }

  const menuItems = ['Large', 'Small']

    return (
        <Flex flexWrap="wrap" alignItems="center">
            <Flex flex="1">
                <Text padding="8px">{itemCount} {t('Items')}</Text>
            </Flex>
            <Flex padding="8px">
                <SortSelect
                    textColor={theme.colors.primary}
                    width="300px"
                    options={sortOptions}
                    onOptionChange={(option) => setSortOption(option.value)}
                    defaultOptionIndex={0}
                    />
            </Flex>
            <Flex padding="8px">
                <ButtonMenu activeIndex={itemSize === ItemSize.LARGE ? 0 : 1} onItemClick={(index) => onItemSizeChange(index === 0 ? ItemSize.LARGE : ItemSize.SMALL)} scale="sm" variant='subtle'>
                    <ButtonMenuItem>{t('Large')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Small')}</ButtonMenuItem>
                </ButtonMenu>
            </Flex>
        </Flex>
    )
}

export default TopNav