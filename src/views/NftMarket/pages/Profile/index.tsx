import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { Route, useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TabToggle2, TabToggleGroup2 } from 'components/TabToggle2'
import { useProfile, useProfileLoggedIn, useProfileName, useProfileTokenData } from 'state/profile/hooks'
import { ProfileLoginStatus } from 'state/types'
import { API_PROFILE } from 'config/constants/endpoints'
import { useAppDispatch } from 'state'
import { updateProfile } from 'state/profile/actions'
import useToast from 'hooks/useToast'
import { parse, parseISO, format } from 'date-fns'
import Banner from './Banner'
import Portrait from './Portrait'
import Assets from './Assets'
import AuthGuard from '../Auth'
import { useUpdateProfile } from '../../hooks/useProfile'
import Collections from './Collections'
import AssetsCreated from './AssetsCreated'
import AssetsCollected from './AssetsCollected'

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

const Profile: React.FC = () => {
    const { t } = useTranslation()
    const loginStatus = useProfileLoggedIn()
    const { path, url, isExact } = useRouteMatch()
    const history = useHistory()
    const dispatch = useAppDispatch()
    const { toastError } = useToast()
    const { pathname } = useLocation()
    const [profileName] = useProfileName()
    const { onUpdatePortfolio, onUpdateBanner } = useUpdateProfile()
    const profile = useProfile()
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

    const joinedAt = useMemo(() => {
        if (profile && profile.createdAt) {
            return format(parseISO(profile.createdAt), 'MMM yyyy')
        }
        return undefined
    }, [profile])

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

    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }
    return (
        <Wrapper>
            <Flex>
                <Banner image={profile.banner} onSelect={handleUploadBanner}/>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
                <Portrait image={profile.portfolio} onSelect={handleUploadPortrait}/>
                <Heading marginTop="8px">
                    {profileName && profileName.length > 0 ? profileName : t('Unnamed')}
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
                                history.push(path)
                            }
                        }}>
                            <Text>{t('Collected')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={tab === ProfileTab.Created} onClick={() => {
                            if (tab !== ProfileTab.Created) {
                                history.push(`${path}/created`)
                            }
                        }}>
                            <Text>{t('Created')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={tab === ProfileTab.Sales} onClick={() => {
                            if (tab !== ProfileTab.Sales) {
                                history.push(`${path}/sales`)
                            }
                        }}>
                            <Text>{t('Sales')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={tab === ProfileTab.Collection} onClick={() => {
                            if (tab !== ProfileTab.Collection) {
                                history.push(`${path}/collections`)
                            }
                        }}>
                            <Text>{t('Collections')}</Text>
                        </TabToggle2>
                    </TabToggleGroup2>
                    <Route exact path={`${path}`} component={AssetsCollected} />
                    <Route exact path={`${path}/created`} component={AssetsCreated} />
                    <Route exact path={`${path}/sales`} component={AssetsCollected} />
                    <Route exact path={`${path}/collections`}>
                        <Collections account={profile.address}/>
                    </Route>
                </StyledPageBody>
            </Flex>

        </Wrapper>
    )
}

export default Profile