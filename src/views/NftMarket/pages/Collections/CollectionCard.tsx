import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { NFTCollection } from 'views/NftMarket/hooks/types'


const Wrapper = styled.div`
    width: 100%;
`


const LinkWrapper = styled(Link)`
    text-decoration: none;
    width: 100%;
    :hover {
        cursor: pointer;
        opacity: 0.7;
    }
`

const Card = styled(Flex).attrs({flexDirection:"column"})`
    border-radius: 16px;
    padding: 1.25rem;
    border-radius: ${({ theme }) => theme.radii.default};
    border: 1px solid rgba(0,0,0,0.2);
    background-color: wite;
`

const FeaturedImageWrapper = styled.div`
    height: 200px;
    background:  ${({ theme }) => theme.colors.backgroundAlt2};
    overflow: hidden;
    display:flex;
    align-items:center;
    justify-content:center;
    >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const Portrait = styled.div`
    border-radius: 50%;
    height: 50px;
    width: 50px;
    background-color: rgb(251, 253, 255);
    border: 3px solid rgb(251, 253, 255);
    box-shadow: rgb(14 14 14 / 60%) 0px 0px 2px 0px;
    overflow: hidden;
    > img {
        object-fit: cover;
    }
`
interface CollectionCardProps {
    collection?: NFTCollection
}

const CollectionCard: React.FC<CollectionCardProps> = ({collection}) => {

    const { t } = useTranslation()
    const truncatedText = useMemo(() => {
        const text = collection?.description ?? ''
        if (text.length > 100) {
            return `${text.substring(0, 100)}...`
        }
        return text
    }, [collection])
    return (
        <LinkWrapper to={`/nft/collection/${collection?.slug ?? 'undefined'}`}>
            <Wrapper>
                <Card>
                    <FeaturedImageWrapper>
                        <img alt={collection ? collection.name : 'Featured Image'} src={collection?.featuredImage} />
                    </FeaturedImageWrapper>
                    
                    <Flex flexDirection="column" marginTop="-36px">
                        <Flex flexDirection="row" justifyContent="center">
                            <Portrait>
                            <img alt={collection ? collection.name : 'Logo'}  src={collection?.logo} />
                            </Portrait>
                        </Flex>

                        <Text fontSize="14px" fontWeight="600" textAlign="center" marginTop="8px">
                            {collection ? collection.name : '-'}
                        </Text>
                        <Text fontSize="14px" textAlign="center" marginTop="8px">
                        {truncatedText}
                        </Text>
                    </Flex>
                    
                </Card>
            </Wrapper>

        </LinkWrapper>
    )
}

export default CollectionCard