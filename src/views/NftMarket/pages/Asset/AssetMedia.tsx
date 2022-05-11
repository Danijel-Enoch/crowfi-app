import React, { useCallback, useMemo, useState } from 'react'
import { Flex, IconButton, Text } from '@pancakeswap/uikit'
import { NFTAssetType, ProfileLoginStatus } from 'state/types'
import { useProfileLoggedIn } from 'state/profile/hooks'
import styled from 'styled-components'
import { Heart } from 'react-feather'
import useToast from 'hooks/useToast'
import { useLogin } from '../../hooks/useLogin'
import { NFTMeta } from '../../hooks/types'
import { useFavoriteNFT } from '../../hooks/useFavoriteNFT'

const Wrapper = styled(Flex).attrs({flexDirection: "column"})`
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    margin: 12px;
`
const Header = styled(Flex).attrs({justifyContent: 'end', alignItems:"center"})`
    background: rgba(255, 255, 255, 0.4);
    margin-right: 12px;
`
const ImgWrapper = styled.div`
    min-height: 200px;
    cursor: pointer;
    > * {
        width: 100%;
        border-bottom-right-radius: ${({ theme }) => theme.radii.default};
        border-bottom-left-radius: ${({ theme }) => theme.radii.default};
    }
`

interface AssetMediaProps {
    metadata?: NFTMeta
    likes?: number
    liked?: boolean
    onMediaClick: () => void
    onToggleFavorite?: () => Promise<void>
}

const AssetMedia: React.FC<AssetMediaProps> = ({metadata, likes, liked, onMediaClick, onToggleFavorite}) => {

    const {loginStatus, profileAddress} = useProfileLoggedIn()
    const { toastError } = useToast()
    const {onLogin} = useLogin()
    const [pending, setPending] = useState(false)

    const handleLogin = useCallback(async () => {

        try {
            setPending(true)
            const res = await onLogin()
        } catch(err) {
            const error = err as any
            toastError(error?.message ? error.message : JSON.stringify(err))
        } finally {
            setPending(false)
        }

    }, [toastError, onLogin])

    const handleSetFavorite = useCallback(async () => {
        try {
            setPending(true)
            onToggleFavorite()
        } catch(err) {
            const error = err as any
            toastError(error?.message ? error.message : JSON.stringify(err))
        } finally {
            setPending(false)
        }
    }, [toastError,  onToggleFavorite])

    const handleFavorite = useCallback(() => {
        if (pending) {
            return
        }

        if (loginStatus === ProfileLoginStatus.LOGGEDIN) {
            handleSetFavorite()
        } else {
            handleLogin()
        }
    }, [pending, loginStatus, handleLogin, handleSetFavorite])

    const assetUrl = useMemo(() => {
        if (!metadata) {
            return undefined
        }
        if (!metadata?.animation_url || metadata?.properties?.type === NFTAssetType.Image) {
            return metadata.image.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
        }

        return metadata?.animation_url?.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')

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
                <IconButton variant="text" onClick={handleFavorite}>
                    {liked ? (
                    <Heart color="rgb(235,87,87)"/>
                    ): (
                    <Heart color="gray"/>
                    )}
                </IconButton>
                <Text color="gray" fontSize='12px'>
                    {likes}
                </Text>
            </Header>
            <ImgWrapper onClick={onMediaClick}>
                {renderMedia()}
            </ImgWrapper>
        </Wrapper>
    )
}

AssetMedia.defaultProps = {
    likes: 0,
    liked: false
}

export default AssetMedia