import React, { useMemo } from 'react'
import { List, Menu, Package } from 'react-feather'
import { Link } from 'react-router-dom'
import { Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import ReactMarkdown from 'components/ReactMarkdown'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink } from 'utils'
import ExpandablePanel from '../../components/ExpandablePanel'
import { NFTMeta } from '../../hooks/types'

interface AssetInfoSectionProps {
    metadata?: NFTMeta
    tokenAddress?: string
    tokenId?: string

}

const AssetInfoSection: React.FC<AssetInfoSectionProps> = ({metadata, tokenAddress, tokenId}) => {

    const { t } = useTranslation()

    
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
                title={t('Collection')}
                topRadius={0}
                hasBottomBorder={false}
                bottomRadius={0}
            >
                <div style={{margin: "12px"}}>
                    <ReactMarkdown>
                        {metadata?.description}
                    </ReactMarkdown>
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