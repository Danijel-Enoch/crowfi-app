import React, { useMemo, useState } from 'react'
import { Box, Button, ButtonMenu, ButtonMenuItem, Flex,  Text } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import BoxButtonMenu from 'components/BoxButtonMenu'
import Select from 'components/Select/Select'
import { ItemSize } from '../Assets/types'

const SortSelect = styled(Select)`
    width: 300px;
`;


interface CollectionsNavProps {
    itemSize: ItemSize
    onItemSizeChange: (itemSize) => void
}

const CollectionsNav: React.FC<CollectionsNavProps> = ({itemSize, onItemSizeChange}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()

    const [activeButtonIndex, setActiveButtonIndex] = useState(0)

  const onMenuItemClick = (index: number) => {
    setActiveButtonIndex(index)
  }

  const menuItems = ['Large', 'Small']

    return (
        <Flex flexWrap="wrap" alignItems="center">
            <Flex flex="1">
                <Button scale="sm" ml="8px" mt="8px" as={Link} to="/nft/create-collection">
                    {t('Create New Collection')}
                </Button>
            </Flex>
            {/* <Flex padding="8px">
                <ButtonMenu activeIndex={itemSize === ItemSize.LARGE ? 0 : 1} onItemClick={(index) => onItemSizeChange(index === 0 ? ItemSize.LARGE : ItemSize.SMALL)} scale="sm" variant='subtle'>
                    <ButtonMenuItem>{t('Large')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Small')}</ButtonMenuItem>
                </ButtonMenu>
            </Flex> */}
        </Flex>
    )
}

export default CollectionsNav