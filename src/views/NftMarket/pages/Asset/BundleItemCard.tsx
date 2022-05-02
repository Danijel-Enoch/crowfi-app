import React, { useMemo, useState } from 'react'
import { Heart, Image, Music, Video } from 'react-feather'
import { Flex, Text } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { NFTAssetType } from 'state/types'
import { BundleItem } from '../../hooks/types'


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
    border-radius: ${({ theme }) => theme.radii.default};
    border: 1px solid rgba(0,0,0,0.2);
    background-color: wite;
`

const ThumbnailContainer = styled.div`
    max-width: 100%;
    aspect-ratio: 1;
    height: auto;
    background: ${({ theme }) => theme.colors.backgroundAlt};
    border-top-right-radius: ${({ theme }) => theme.radii.default};
    border-top-left-radius: ${({ theme }) => theme.radii.default};
    overflow: hidden;

    >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const TypeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: absolute;
    top: -50px;
    right: -8px;

    > svg {
        -webkit-filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.6));
        filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.6));
    }
`

const Footer = styled(Flex).attrs({justifyContent:'end', alignItems:'center'})`
    border-top: 1px solid rgba(0,0,0,0.2);
    padding: 8px 0px;
`

interface AssetCardProps {
    item?: BundleItem
}

const BundleItemCard: React.FC<AssetCardProps> = ({item}) => {

    const { t } = useTranslation()

    const mediaType = useMemo(() => {
        return item?.meta?.properties?.type ?? NFTAssetType.Image
    }, [item.meta])

    return (
        <LinkWrapper to={`/nft/asset/${item?.asset?.contractAddress}/${item?.asset?.tokenId}`}>
            <Wrapper>
                <Card>
                    <ThumbnailContainer>
                        <img alt={item?.meta?.name} src={item?.meta?.image} />
                    </ThumbnailContainer>
                    <Flex flexDirection="row" margin="16px" position="relative">
                        <TypeWrapper>
                            {mediaType === 'image' && (
                            <Image color="white"/>
                            )}
                            {mediaType === 'video' && (
                            <Video color="white"/>
                            )}
                            {mediaType === 'audio' && (
                            <Music color="white"/>
                            )}
                        </TypeWrapper>
                        <Flex flexDirection="column" flex="3" paddingRight="4px">
                            <Text fontSize="12px" ellipsis>
                                {item?.meta?.name} #{item?.asset?.tokenId}
                            </Text>
                        </Flex>
                        {/* <Flex flexDirection="column" flex="2" maxWidth="40%" justifyContent="right" alignItems="right">
                            <Text textAlign="right" fontSize="12px">
                                {t('Price')}
                            </Text>
                            <Text textAlign="right" fontSize="12px" style={{whiteSpace:'nowrap'}}>
                                {asset?.currentPrice ? asset?.currentPrice : '0'} {ETHER.symbol}
                            </Text>
                        </Flex> */}
                    </Flex>
                    <Footer>
                        <Heart color="gray" width="20px"/>
                        <Text color="gray" fontSize='12px' mx="8px">
                            {t('Amount: ')} {item.amount}
                        </Text>
                    </Footer>
                </Card>
            </Wrapper>

        </LinkWrapper>
    )
}

export default BundleItemCard