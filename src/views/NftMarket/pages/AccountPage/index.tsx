import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { Route, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TabToggle2, TabToggleGroup2 } from 'components/TabToggle2'
import { useProfileLoggedIn, } from 'state/profile/hooks'
import { updateProfile } from 'state/profile/actions'
import { ProfileLoginStatus } from 'state/types'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import useToast from 'hooks/useToast'
import { parseISO, format } from 'date-fns'
import { UserResponse } from '../../hooks/types'
import { fetchUserProfile, useUpdateProfile } from '../../hooks/useProfile'
import Banner from './Banner'
import Portrait from './Portrait'
import Collections from './Collections'
import AssetsCreated from './AssetsCreated'
import AssetsCollected from './AssetsCollected'
import AssetsOnSale from './AssetsOnSale'

const Wrapper = styled(Flex).attrs({flexDirection: "column"})`
    background-color: white;
`

const StyledPageBody = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    width: 100%;
    z-index: 1;
`

enum ProfileTab {
    Collected,
    Created,
    Sales,
    Collection
}

const AccountPage: React.FC = () => {
    const { t } = useTranslation()
    const { address: userAddress } = useParams<{ address: string }>()
    const { loginStatus, profileAddress } = useProfileLoggedIn()
    const { pathname } = useLocation()
    const { path, url, isExact } = useRouteMatch()
    const history = useHistory()
    const { slowRefresh } = useRefresh()
    const dispatch = useAppDispatch()
    const { toastError } = useToast()
    const [ profile, setProfile ] = useState<UserResponse>(null)
    const { onUpdatePortfolio, onUpdateBanner } = useUpdateProfile()
    const [loaded, setLoaded] = useState(false)
    
    const tab = useMemo(() => {
        if (pathname.includes('sales')) {
            return ProfileTab.Sales
        }
        if (pathname.includes('created')) {
            return ProfileTab.Created
        }
        if (pathname.includes('collections')) {
            return ProfileTab.Collection
        }

        return ProfileTab.Collected
    }, [pathname])

    const basePath = useMemo(() => {
        return path.replace(':address', userAddress)
    }, [path, userAddress])

    const joinedAt = useMemo(() => {
        if (profile && profile?.createdAt) {
            return format(parseISO(profile?.createdAt), 'MMM yyyy')
        }
        return undefined
    }, [profile])

    const isMe = useMemo(() => {

        return loginStatus === ProfileLoginStatus.LOGGEDIN && userAddress?.toLowerCase() === profileAddress.toLowerCase()

    }, [userAddress, profileAddress, loginStatus])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile_ = await fetchUserProfile(userAddress)
                if (profile_) {
                    setProfile(profile_)
                }
            } finally {
                setLoaded(true)
            }
        }
        fetchProfile()

    }, [slowRefresh, userAddress])



    const handleUploadPortrait = useCallback(async (file: File) => {
        
        try {
            const portfolioUrl = await onUpdatePortfolio(file)
            dispatch(updateProfile({profile: {portfolio: portfolioUrl}}))
        } catch(e) {
            const error = e as Error
            toastError(t('Error'), error?.message ?? "Failed to upload")
        }

    }, [t, dispatch, toastError, onUpdatePortfolio])

    const handleUploadBanner = useCallback(async (file: File) => {
        
        try {
            const bannerUrl = await onUpdateBanner(file)
            dispatch(updateProfile({profile: {banner: bannerUrl}}))
        } catch(e) {
            const error = e as Error
            toastError(t('Error'), error?.message ?? "Failed to upload")
        }

    }, [t, dispatch, toastError, onUpdateBanner])

    return (
        <Wrapper>
            <Flex>
                <Banner image={profile?.banner} enabled={isMe} onSelect={handleUploadBanner}/>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
                <Portrait image={profile?.portfolio} enabled={isMe} onSelect={handleUploadPortrait}/>
                <Heading marginTop="8px">
                    {profile?.name && profile?.name.length > 0 ? profile?.name : t('Unnamed')}
                </Heading>
                <Text marginTop="8px">
                    {joinedAt ? t('Joined %date%', {date: joinedAt}) : '-'}
                </Text>
            </Flex>
            <Flex marginTop="16px">
                <StyledPageBody flexDirection="column" flex="1" margin={["0px 12px 24px 12px", null, null, "0px 24px 24px 24px"]}>
                    <TabToggleGroup2>
                        <TabToggle2 isActive={tab === ProfileTab.Collected} onClick={() => {
                            if (tab !== ProfileTab.Collected) {
                                history.push(basePath)
                            }
                        }}>
                            <Text>{t('Collected')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={tab === ProfileTab.Created} onClick={() => {
                            if (tab !== ProfileTab.Created) {
                                history.push(`${basePath}/created`)
                            }
                        }}>
                            <Text>{t('Created')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={tab === ProfileTab.Sales} onClick={() => {
                            if (tab !== ProfileTab.Sales) {
                                history.push(`${basePath}/sales`)
                            }
                        }}>
                            <Text>{t('Sales')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={tab === ProfileTab.Collection} onClick={() => {
                            if (tab !== ProfileTab.Collection) {
                                history.push(`${basePath}/collections`)
                            }
                        }}>
                            <Text>{t('Collections')}</Text>
                        </TabToggle2>
                    </TabToggleGroup2>
                    <Route exact path={`${path}`} component={AssetsCollected} />
                    <Route exact path={`${path}/created`} component={AssetsCreated} />
                    <Route exact path={`${path}/sales`} component={AssetsOnSale} />
                    <Route exact path={`${path}/collections`}>
                        <Collections account={profile?.address}/>
                    </Route>
                </StyledPageBody>
            </Flex>

        </Wrapper>
    )
}

export default AccountPage