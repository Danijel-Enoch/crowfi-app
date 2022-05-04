import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Flex } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTCollection } from '../../hooks/types'

const Wrapper = styled.div`
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme }) => theme.colors.background};
    padding: 12px 0px;
`


interface HeaderNavProps {
    collection?: NFTCollection
    editor?: boolean
    minter?: boolean
}

const HeaderNav: React.FC<HeaderNavProps> = ({collection, editor, minter}) => {

    const { t } = useTranslation()
    const history = useHistory()

    const onGoPath = (path) => {
        history.push(path)
    }

    return (
        <Wrapper>
        <Container>
            <Flex justifyContent="end">
                {editor && (
                <Button mx="6px" as={Link} to={`/nft/collection/${collection.slug}/edit`}>
                    {t('Edit')}
                </Button>
                )}
                { minter && (
                <Button mx="6px" as={Link} to={`/nft/collection/${collection.slug}/assets/create`}>
                    {t('Add New Item')}
                </Button>
                )}
            </Flex>
        </Container>
        </Wrapper>
    )
}

HeaderNav.defaultProps = {
    editor: false,
    minter: false
}

export default HeaderNav