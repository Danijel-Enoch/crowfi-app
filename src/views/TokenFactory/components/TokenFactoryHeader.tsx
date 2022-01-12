import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export interface TokenFactoryHeaderProps {
    tokens: number
    network: string
}

const TokenFactoryHeader: React.FC<TokenFactoryHeaderProps> = ({tokens, network}) => {

    const { t } = useTranslation()

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <Heading color='primary' scale="xl" textAlign="center">
                    {tokens}
                </Heading>
                <Text color='secondary' textAlign="center">
                    {t('tokens')}
                </Text>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('Created on %network%', {network})}
                </Text>
            </Flex>
        </>
    )
    
}

export default TokenFactoryHeader