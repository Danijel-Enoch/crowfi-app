import React, { useCallback, useState } from 'react'
import { Button, Flex } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import ConnectWalletButton from 'components/ConnectWalletButton'
import styled from 'styled-components'
import { ProfileLoginStatus } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Dots from 'components/Loader/Dots'
import useToast from 'hooks/useToast'
import { useLogin } from '../../hooks/useLogin'

const Wrapper = styled.div`
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme }) => theme.colors.background};
    padding: 12px 0px;
`
interface LoginNavProps {
    loginStatus: ProfileLoginStatus
    account?: string
}

const LoginNav: React.FC<LoginNavProps> = ({account, loginStatus}) => {

    const { t } = useTranslation()
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

    return (
        <Wrapper>
        <Container>
            <Flex justifyContent="end">
                { account ? (
                    <Button onClick={handleLogin} disabled={pending || !account}>
                    {pending ? (<Dots>{t('Pleaes wait')}</Dots>) :  t('Login with my wallet')}
                    </Button>
                ) : (
                    <ConnectWalletButton/>
                )}
            </Flex>
        </Container>
        </Wrapper>
    )
}

export default LoginNav