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

enum AssetSortOption {
    LISTED,
    CREATED,
    SOLD,
    RECEIVED,
    ENDING,
    PRICE_ASC,
    PRICE_DESC,
}

interface TopNavProps {
    itemCount?: number
    itemSize: ItemSize
    onItemSizeChange: (itemSize) => void
}

const TopNav: React.FC<TopNavProps> = ({itemCount, itemSize, onItemSizeChange}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const [sortOption, setSortOption] = useState(AssetSortOption.LISTED)

    const sortOptions = [
        { label: t('Recently Listed'), value: AssetSortOption.LISTED },
        { label: t('Recently Created'), value: AssetSortOption.CREATED },
        { label: t('Recently Sold'), value: AssetSortOption.SOLD },
        { label: t('Recently Received'), value: AssetSortOption.RECEIVED },
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