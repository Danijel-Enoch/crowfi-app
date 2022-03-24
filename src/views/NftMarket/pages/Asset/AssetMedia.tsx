import React, { useMemo } from 'react'
import { Flex, IconButton } from '@pancakeswap/uikit'
import { NFTAssetType } from 'state/types'
import styled from 'styled-components'
import { NFTMeta } from 'views/NftMarket/hooks/types'
import { Heart } from 'react-feather'

const Wrapper = styled(Flex).attrs({flexDirection: "column"})`
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    margin: 12px;
`
const Header = styled(Flex).attrs({justifyContent: 'end'})`
    background: rgba(255, 255, 255, 0.4);
`
const ImgWrapper = styled.div`
    min-height: 200px;
    > * {
        width: 100%;
        border-bottom-right-radius: ${({ theme }) => theme.radii.default};
        border-bottom-left-radius: ${({ theme }) => theme.radii.default};
    }
`

interface AssetMediaProps {
    metadata?: NFTMeta
}

const AssetMedia: React.FC<AssetMediaProps> = ({metadata}) => {

    const assetUrl = useMemo(() => {
        if (!metadata) {
            return undefined
        }
        if (metadata?.properties?.type === NFTAssetType.Image) {
            return metadata.image
        }

        return metadata?.animation_url

    }, [metadata])

    const renderMedia = () => {
        if (!metadata) {
            return (<></>)
        }

        if (metadata?.properties?.type === NFTAssetType.Video) {
            return (<video controls src={assetUrl}/>)
        }

        if (metadata?.properties?.type === NFTAssetType.Audio) {
            return (<audio controls src={assetUrl}/>)
        }

        return <img src={assetUrl} alt="media"/>
    }


    return (
        <Wrapper>
            <Header>
                <IconButton variant="text">
                    <Heart/>
                </IconButton>
            </Header>
            <ImgWrapper>
                {renderMedia()}
            </ImgWrapper>
        </Wrapper>
    )
}

export default AssetMedia