import React, { useMemo } from 'react'
import { List, Menu, Package } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import ReactMarkdown from 'components/ReactMarkdown'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { LinkWrapper } from 'components/Launchpad/StyledControls'
import { getBscScanLink } from 'utils'
import ExpandablePanel from '../../components/ExpandablePanel'
import { NFTMeta, NFTResponse } from '../../hooks/types'

const CollectionLogoWrapper = styled.div`
    width: 80px;
    height: 80px;
    > img {
        width: 100%;
        height: 100%;
        object-fit:contain;
    }

`

interface AssetInfoSectionProps {
    metadata?: NFTMeta
    tokenAddress?: string
    tokenId?: string
    nft?: NFTResponse
}

const AssetInfoSection: React.FC<AssetInfoSectionProps> = ({metadata, tokenAddress, tokenId, nft}) => {

    const { t } = useTranslation()

    console.log(nft?.collection)

    
    return (
        <>
        <Flex flexDirection="column" padding="12px">
            <ExpandablePanel
                enabled={false}
                collapsed={false}
                hasBottomBorder={false}
                bottomRadius={0}
                icon={<Menu/>}
                title={t('Description')}
            >
                <div style={{margin: "12px"}}>
                    <ReactMarkdown>
                        {metadata?.description}
                    </ReactMarkdown>
                </div>
            </ExpandablePanel>
            <ExpandablePanel
                collapsed
                icon={<Package/>}
                title={t('About %name%', {name: nft?.collection?.name ?? ''})}
                topRadius={0}
                hasBottomBorder={false}
                bottomRadius={0}
            >
                <div style={{margin: "12px"}}>
                    <Flex flexDirection="column">
                        <Flex>
                            <LinkWrapper to={`/nft/collection/${nft?.collection?.slug}`}>
                                <CollectionLogoWrapper>
                                    <img alt="collection" src={nft?.collection?.logo}/>
                                </CollectionLogoWrapper>
                            </LinkWrapper>
                            <Flex flex="1">
                                <Text>{nft?.collection?.description}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </div>
            </ExpandablePanel>
            <ExpandablePanel
                collapsed
                icon={<List/>}
                title={t('Details')}
                topRadius={0}
            >
                <Flex flexDirection="column" style={{margin: "12px"}}>
                    <Flex justifyContent="space-between" margin="4px">
                        <Text fontSize="14px">
                            {t('Contract Address')}
                        </Text>
                        <LinkExternal href={getBscScanLink(tokenAddress, 'address')}>
                            {tokenAddress ? truncateHash(tokenAddress) : ''}
                        </LinkExternal>
                        
                    </Flex>
                    <Flex justifyContent="space-between" margin="4px">
                        <Text fontSize="14px">
                            {t('Token ID')}
                        </Text>
                        <Text fontSize="14px">
                            {tokenId}
                        </Text>
                    </Flex>
                    <Flex justifyContent="space-between" margin="4px">
                        <Text fontSize="14px">
                            {t('Metadata')}
                        </Text>
                        <Text fontSize="14px">
                            {t('Centeralized')}
                        </Text>
                    </Flex>
                </Flex>
            </ExpandablePanel>
        </Flex>
        </>
    )
}

export default AssetInfoSection