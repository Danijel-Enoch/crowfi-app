import React, { useMemo } from 'react'
import { Flex, IconButton } from '@pancakeswap/uikit'
import { NFTAssetType } from 'state/types'
import styled from 'styled-components'
import { NFTMeta } from 'views/NftMarket/hooks/types'
import { Heart } from 'react-feather'

const Wrapper = styled(Flex).attrs({flexDirection: "column", alignItems:"center", justifyContent:"center"})`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(200, 200, 200, 0.4);
    -webkit-transition: opacity 0.4s;
    transition: opacity 0.4s;
    z-index: 1000;
    pointer-events: initial;
`

const BehindWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
`

const PlayerWrapper = styled(Flex).attrs({flexDirection:"column"})`
    width: 80vw;
    max-width: 600px;
`
const ImgWrapper = styled.div`
    min-height: 200px;
    > * {
        width: 100%;
    }
`

interface MediaViewerProps {
    metadata?: NFTMeta
    onDismiss: () => void
}

const MediaViewer: React.FC<MediaViewerProps> = ({metadata, onDismiss}) => {

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
            <BehindWrapper onClick={onDismiss}/>
            <PlayerWrapper>
                <ImgWrapper>
                    {renderMedia()}
                </ImgWrapper>
            </PlayerWrapper>
        </Wrapper>
    )
}

export default MediaViewer