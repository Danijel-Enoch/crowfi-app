import React, { useMemo } from 'react'
import { AlignLeft, BarChart, List, Menu, Package, Tag } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import { NFTContractTypes } from 'state/types'
import ReactMarkdown from 'components/ReactMarkdown'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { LinkWrapper } from 'components/Launchpad/StyledControls'
import { getBscScanLink } from 'utils'
import ExpandablePanel from '../../components/ExpandablePanel'
import { NFTAsset, NFTBalanceResponse, NFTCollection, NFTMeta, NFTResponse } from '../../hooks/types'
import TextTrait from '../../components/TextTrait'

const CollectionLogoWrapper = styled.div`
    width: 80px;
    height: 80px;
    margin-right: 12px;
    > img {
        width: 100%;
        height: 100%;
        object-fit:contain;
    }

`

interface AssetInfoSectionProps {
    metadata?: NFTMeta
    asset?: NFTAsset
    collection?: NFTCollection
    balance?: NFTBalanceResponse
}

const AssetInfoSection: React.FC<AssetInfoSectionProps> = ({metadata, asset, collection, balance}) => {

    const { t } = useTranslation()

    const textAttributes = metadata?.attributes?.filter((item) => {
        return typeof item.value === 'string'
    })

    const numberAttributes = metadata?.attributes?.filter((item) => {
        return typeof item.value === 'number'
    })
    
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
            { collection && (
            <ExpandablePanel
                collapsed
                icon={<Package/>}
                title={t('About %name%', {name: collection?.name ?? ''})}
                topRadius={0}
                hasBottomBorder={false}
                bottomRadius={0}
            >
                <div style={{margin: "12px"}}>
                    <Flex flexDirection="column">
                        <Flex>
                            <LinkWrapper to={`/nft/collection/${collection?.slug}`}>
                                <CollectionLogoWrapper>
                                    <img alt="collection" src={collection?.logo}/>
                                </CollectionLogoWrapper>
                            </LinkWrapper>
                            <Box>
                                <ReactMarkdown>
                                {collection?.description}
                                </ReactMarkdown>
                            </Box>
                        </Flex>
                    </Flex>
                </div>
            </ExpandablePanel>
            )}
            { textAttributes && textAttributes.length > 0 && (
                <ExpandablePanel
                    collapsed
                    icon={<AlignLeft/>}
                    title={t('Properties')}
                    topRadius={0}
                    hasBottomBorder={false}
                    bottomRadius={0}
                >
                    <div style={{margin: "12px"}}>
                        <Flex flexWrap="wrap">
                            {textAttributes.map((item) => {
                                return (
                                    <Flex marginRight="8px" marginBottom="4px" marginTop="4px">
                                        <TextTrait trait={item}/>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </div>
                </ExpandablePanel>
            )}
            { numberAttributes && numberAttributes.length > 0 && (
                <ExpandablePanel
                    collapsed
                    icon={<BarChart/>}
                    title={t('Stats')}
                    topRadius={0}
                    hasBottomBorder={false}
                    bottomRadius={0}
                >
                    <div style={{margin: "12px"}}>
                        <Flex flexDirection="column">
                            {numberAttributes.map((item) => {
                                return (
                                    <Flex margin="4px 0px">
                                        <Flex flex="1">
                                            <Text fontSize="14px" ellipsis>
                                                {item.trait_type}
                                            </Text>
                                        </Flex>
                                        <Text fontSize="14px">
                                            {item.value}{item.max_value ? ` of ${item.max_value}` : ''}
                                        </Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </div>
                </ExpandablePanel>
            )}
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
                        <LinkExternal href={getBscScanLink(asset.contractAddress, 'address')}>
                            {asset.contractAddress ? truncateHash(asset.contractAddress) : ''}
                        </LinkExternal>
                        
                    </Flex>
                    <Flex justifyContent="space-between" margin="4px">
                        <Text fontSize="14px">
                            {t('Token ID')}
                        </Text>
                        <Text fontSize="14px">
                            {asset.tokenId}
                        </Text>
                    </Flex>
                    <Flex justifyContent="space-between" margin="4px">
                        <Text fontSize="14px">
                            {t('Token Type')}
                        </Text>
                        <Text fontSize="14px">
                            {NFTContractTypes[asset.contractType]}
                        </Text>
                    </Flex>
                    { balance && (
                        <Flex justifyContent="space-between" margin="4px">
                            <Text fontSize="14px">
                                {t('Total Supply')}
                            </Text>
                            <Text fontSize="14px">
                                {balance.total}
                            </Text>
                        </Flex>
                    )}
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