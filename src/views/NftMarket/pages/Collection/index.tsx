
import React, { useCallback, useEffect, useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Flex, Heading, LanguageIcon, LogoIcon, Spinner, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useRefresh from 'hooks/useRefresh'
import { NFTCollection } from '../../hooks/types'
import { getCollectionWithSlug } from '../../hooks/useCollections'
import SiteLinks from './SiteLinks'
import Assets from './Assets'
import DescriptionSection from './DescriptionSection'
import { getNftsWithQueryParams } from '../../hooks/useGetNFT'

const BlankPage = styled.div`
    position:relative;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 540px);

    ${({ theme }) => theme.mediaQueries.sm} {
        padding-top: 32px;
        min-height: calc(100vh - 380px);
    }

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 32px;
        min-height: calc(100vh - 336px);
    }
`

const SpinnerWrapper = styled(Flex)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`
const FullWidthFlex = styled(Flex)`
    width: 100%;
`

const Banner = styled.div`
    height: 220px;
    overflow: hidden;
    background: rgb(229, 232, 235);
    >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const LogoWrapper = styled.div`
    margin-top: -80px;
    position: relative;
    border: 2px solid rgb(255, 255, 255);
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    overflow: hidden;
`

const Logo = styled.div`
    width: 130px;
    height: 130px;
    display: flex;
    justify-content:center;
    align-items:center;

    > img {
        display: flex;
        object-fit: cover;
        width: 130px;
        height: 130px;
    }
`

const Collection: React.FC<RouteComponentProps<{slug: string}>> = ({
    match: {
        params: {slug}
    }
}) => {

    const { t } = useTranslation()
    const { account } = useWeb3React()
    const { slowRefresh } = useRefresh()
    const [collection, setCollection] = useState<NFTCollection|null>(null)
    const [isValid, setIsValid] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [needReload, setNeedReload] = useState(false)
    const [nfts, setNfts] = useState([])

    useEffect(() => {
        const fetchCollection = async() => {
            try {
                const collection_ = await getCollectionWithSlug(slug)
                if (!collection_) {
                    setIsValid(false)
                } else {
                    setIsValid(true)
                    setCollection(collection_)

                    const {rows, count} = await getNftsWithQueryParams({collectionId: collection_.id})
                    setNfts(rows)
                }
            } catch (e) {
                setIsValid(false)
            }
            setLoaded(true)
            setNeedReload(false)
        }
            
        fetchCollection()
        
    }, [slug, needReload, slowRefresh])

    const triggerReload = () =>  {
        if (needReload) {
            setNeedReload(false)
            setNeedReload(true)
        } else {
            setNeedReload(true)
        }
    }

    const renderContent = () =>  {
        return (
            <Flex flexDirection="column" background="white">
                <Banner>
                    <img alt={collection.name} src={collection.bannerImage}/>
                </Banner>
                <Flex flexDirection="column" alignItems="center"> 
                    <LogoWrapper>
                    <Logo>
                        <img alt={collection.name} src={collection.logo}/>
                    </Logo>
                    </LogoWrapper>
                    <Heading marginTop="8px">
                        {collection.name}
                    </Heading>

                    <SiteLinks collection={collection} />

                    { collection.description && collection.description.length > 0 && (
                        <DescriptionSection text={collection.description}/>
                    )}
                </Flex>

                <Assets items={nfts}/>
                
            </Flex>
        )
    }
    
    return (
        <>
        { !loaded && (
            <BlankPage>
                <SpinnerWrapper >
                    <FullWidthFlex justifyContent="center" alignItems="center">
                        <Spinner />
                    </FullWidthFlex>
                </SpinnerWrapper>
            </BlankPage>
        )}
        { loaded && !isValid && (
            <BlankPage>
                <LogoIcon width="64px" mb="8px" />
                <Heading scale="xxl">404</Heading>
                <Text mb="16px">{t('Oops, page not found.')}</Text>
                <Button as={Link} to="/" scale="sm">
                {t('Back Home')}
                </Button>
            </BlankPage>
        )}

        { loaded && isValid && renderContent()}
        </>
    )
}

export default Collection