import React, { useState } from 'react'
import { Flex, Heading, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Hero = () => {

    const { t } = useTranslation()

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <Heading color='primary' scale="xl" textAlign="center">
                    {t('The Launchpad Protocol for You!')}
                </Heading>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('CrowFi Launchpad helps everyone to create their own tokens and token sales in few seconds.')}
                </Text>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('Tokens created here will be verified and published on explorer websites.')}
                </Text>
                <Flex flexDirection="row" justifyContent="center" mt="12px">
                    <Button as="a" href="/utilities/token-factory">
                        {t('Create Now')}
                    </Button>
                </Flex>
            </Flex>
        </>
    )
    
}

export default Hero