import React, { useMemo } from 'react'
import { Flex, SwapVertIcon } from '@pancakeswap/uikit'
import { NFTAssetType } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { NFTMeta } from '../../hooks/types'
import ExpandablePanel from '../../components/ExpandablePanel'

interface ActivitySectionProps {
    metadata: NFTMeta
}

const ActivitySection: React.FC<ActivitySectionProps> = ({metadata}) => {

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
                icon={<SwapVertIcon/>}
                title={t('Item Activity')}
            >
                <div style={{height: "100px"}}/>
            </ExpandablePanel>
        </Flex>
    )
}

export default ActivitySection