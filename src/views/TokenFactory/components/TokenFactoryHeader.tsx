import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text, Button, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useTokensCreated } from 'state/tokenFactory/hooks'

export interface TokenFactoryHeaderProps {
    tokens: number
    network: string
}

const TokenFactoryHeader: React.FC<TokenFactoryHeaderProps> = ({tokens, network}) => {

    const { t } = useTranslation()

    const totalTokens = useTokensCreated()

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <Heading color='primary' scale="xl" textAlign="center">
                    {totalTokens ? totalTokens.toString() : <Skeleton width="100px" height="40px"/>}
                </Heading>
                <Text color='secondary' textAlign="center">
                    {t('Tokens Created')}
                </Text>
            </Flex>
        </>
    )
    
}

export default TokenFactoryHeader