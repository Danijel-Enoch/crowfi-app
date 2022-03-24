import { API_PROFILE } from 'config/constants/endpoints'
import React, { useCallback, useEffect, useState } from 'react'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { useWeb3React } from '@web3-react/core'
import { signMessage } from 'utils/web3React'

export const useLogin = () => {
    const { library } = useWeb3Provider()
    const {account} = useWeb3React()
    const handleLogin = useCallback(async() => {
        const signature = await signMessage(library, account, account)
        const response = await fetch(`${API_PROFILE}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            address: account,
            signature,
            }),
        })

        if (response.ok) {
            const data = await response.json()
            const expiresIn = data?.data?.expiresIn ?? 0
            const expiresAt = new Date().getTime() / 1000 + expiresIn
            const accessToken = data?.data?.token ?? ''

            return {
                tokenData: {expiresAt, accessToken},
                user: data?.user
            }
        }

        throw new Error('Failed to login')
    }, [library, account])

    return {onLogin: handleLogin}
}