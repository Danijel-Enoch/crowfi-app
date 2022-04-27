import React, { useMemo } from 'react'
import { ChartIcon, Flex, Text } from '@pancakeswap/uikit'
import { NFTAssetType } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import ExpandablePanel from '../../components/ExpandablePanel'
import { NFTMeta } from '../../hooks/types'

interface PriceHistorySectionProps {
    metadata: NFTMeta
}

const PriceHistorySection: React.FC<PriceHistorySectionProps> = ({metadata}) => {

    const { t } = useTranslation()

    const assetUrl = useMemo(() => {
        if (metadata.properties?.type === NFTAssetType.Image) {
            return metadata.image
        }

        return metadata.animation_url

    }, [metadata])

    
    return (
        <Flex flexDirection="column" padding="12px">
            <ExpandablePanel
                icon={<ChartIcon/>}
                title={t('Price History')}
            >
                <Flex flexDirection="column" margin="12px">
                    <Flex justifyContent="center">
                        <ChartIcon width="120px" height="120px"/>
                    </Flex>
                    <Flex justifyContent="center">
                        <Text>{t('No item activity yet')}</Text>
                    </Flex>
                    
                </Flex>
            </ExpandablePanel>
        </Flex>
    )
}

export default PriceHistorySection