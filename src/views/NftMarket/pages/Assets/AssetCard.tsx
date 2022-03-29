import React, { useMemo, useState } from 'react'
import { Image, Music, Video } from 'react-feather'
import { Flex, Text } from '@pancakeswap/uikit'
import { ETHER } from '@pancakeswap/sdk'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { NFTResponse } from '../../hooks/types'


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

const Thumbnail = styled.img`
    aspect-ratio: 1;
    object-fit: cover;
    background: white;
    border-top-right-radius: ${({ theme }) => theme.radii.default};
    border-top-left-radius: ${({ theme }) => theme.radii.default};
`

const TypeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: absolute;
    top: -40px;
    right: 10px;

    > svg {
        -webkit-filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.6));
        filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.6));
    }
`

interface AssetCardProps {
    asset?: NFTResponse
}

const AssetCard: React.FC<AssetCardProps> = ({asset}) => {

    const { t } = useTranslation()

    return (
        <LinkWrapper to={`/nft/asset/${asset?.contractAddress}/${asset?.tokenId}`}>
            <Wrapper>
                <Card>
                    <Thumbnail alt={asset?.name} src={asset?.thumbnail} />
                    <Flex flexDirection="row" marginTop="8px" padding="16px" position="relative">
                        <TypeWrapper>
                            {asset?.mediaType === 'image' && (
                            <Image color="white"/>
                            )}
                            {asset?.mediaType === 'video' && (
                            <Video color="white"/>
                            )}
                            {asset?.mediaType === 'audio' && (
                            <Music color="white"/>
                            )}
                        </TypeWrapper>
                        <Flex flexDirection="column" flex="4">
                            <Text fontSize="12px">
                                {asset?.collection?.name}
                            </Text>
                            <Text fontSize="12px">
                                {asset?.name} #{asset?.tokenId}
                            </Text>
                        </Flex>
                        <Flex flexDirection="column" flex="3" justifyContent="right" alignItems="right">
                            <Text textAlign="right" fontSize="12px">
                                {t('Price')}
                            </Text>
                            <Text textAlign="right" fontSize="12px">
                                {asset?.currentPrice ? asset?.currentPrice : '0'} {ETHER.symbol}
                            </Text>
                            {/* <Text textAlign="right" fontSize="12px">
                                3 hours left
                            </Text> */}
                        </Flex>
                    </Flex>
                </Card>
            </Wrapper>

        </LinkWrapper>
    )
}

export default AssetCard