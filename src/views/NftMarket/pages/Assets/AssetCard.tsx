import React, { useMemo, useState } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
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
    border-radius: 16px;
    padding: 1.25rem;
    border-radius: ${({ theme }) => theme.radii.default};
    border: 1px solid rgba(0,0,0,0.2);
    background-color: wite;
`

interface AssetCardProps {
    asset?: NFTResponse
}

const AssetCard: React.FC<AssetCardProps> = ({asset}) => {

    const { t } = useTranslation()

    return (
        <LinkWrapper to={`/nft/asset/${asset?.collection?.contract}/${asset?.tokenId}`}>
            <Wrapper>
                <Card>
                    <img alt={asset?.name} src={asset?.thumbnail} />
                    <Flex flexDirection="row" marginTop="8px">
                        <Flex flexDirection="column" flex="4">
                            <Text fontSize="12px">
                                {asset?.collection?.name}
                            </Text>
                            <Text fontSize="12px">
                                {asset?.collection?.name} #{asset?.tokenId}
                            </Text>
                        </Flex>
                        <Flex flexDirection="column" flex="3" justifyContent="right" alignItems="right">
                            <Text textAlign="right" fontSize="12px">
                                {t('Price')}
                            </Text>
                            <Text textAlign="right" fontSize="12px">
                                11.00 CRO
                            </Text>
                            <Text textAlign="right" fontSize="12px">
                                3 hours left
                            </Text>
                        </Flex>
                    </Flex>
                </Card>
            </Wrapper>

        </LinkWrapper>
    )
}

export default AssetCard