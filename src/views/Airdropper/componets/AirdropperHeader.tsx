import React from 'react'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export interface AirdropperHeaderProps {
    tokens: number
    network: string
}

const AirdropperHeader: React.FC<AirdropperHeaderProps> = ({tokens, network}) => {

    const { t } = useTranslation()

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <Heading color='primary' scale="xl" textAlign="center">
                    {tokens}
                </Heading>
                <Text color='secondary' textAlign="center">
                    {t('Tokens Airdropped')}
                </Text>
            </Flex>
        </>
    )
    
}

export default AirdropperHeader