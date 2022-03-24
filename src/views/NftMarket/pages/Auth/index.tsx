import React, { useCallback, useEffect, useState } from 'react'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Dots from 'components/Loader/Dots'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { ProfileLoginStatus } from 'state/types'
import {  useProfileLoggedIn} from 'state/profile/hooks'
import { updateProfileAccessTokenData, updateProfileComplete } from 'state/profile/actions'
import useToast from 'hooks/useToast'
import LoadingPage from '../../components/LoadingPage'
import { useLogin } from '../../hooks/useLogin'

const Wrapper = styled.div`
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

const AuthGuard: React.FC = () => {
    const loginStatus = useProfileLoggedIn()
    const {t} = useTranslation()
    const { toastError } = useToast()
    const {account} = useWeb3React()
    const dispatch = useAppDispatch()
    const {onLogin} = useLogin()

    const [pending, setPending] = useState(false)

    const handleLogin = useCallback(async () => {

        try {
            setPending(true)
            const res = await onLogin()
            dispatch(updateProfileAccessTokenData({tokenData: res.tokenData}))
            dispatch(updateProfileComplete({profile: res.user ?? {}}))
        } catch(err) {
            const error = err as any
            toastError(error?.message ? error.message : JSON.stringify(err))
        } finally {
            setPending(false)
        }

    }, [dispatch, toastError, onLogin])

    if (loginStatus === ProfileLoginStatus.NOT_CONNECTED) {
        return (
            <Wrapper>
                <Flex flexDirection="column" alignItems="center">
                    <Heading mb="16px">
                        {t('Connect your wallet')}
                    </Heading>
                    <Text mb="16px">
                        {t('Connect with your wallet to continue')}
                    </Text>
                </Flex>
                <ConnectWalletButton/>
            </Wrapper>
        )
    }

    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return (
            <Wrapper>
                <Flex flexDirection="column" alignItems="center">
                    <Heading mb="16px">
                        {t('Login with your wallet')}
                    </Heading>
                    <Text mb="16px">
                        {t('Login with your wallet to continue')}
                    </Text>
                    <Button onClick={handleLogin} disabled={pending || !account}>
                        {pending ? (<Dots>{t('Pleaes wait')}</Dots>) :  t('Login with my wallet')}
                    </Button>
                </Flex>
            </Wrapper>
        )
    }
    
    return (
        <LoadingPage/>
    )
}

export default AuthGuard