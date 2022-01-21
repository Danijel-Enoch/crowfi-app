import React, { useState } from 'react'
import { Flex, Heading, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import IconCard, { IconCardData } from 'views/Home/components/IconCard'
import { LinkWrapper } from '../styled'

const PresaleSection = () => {

    const { t } = useTranslation()

    const cardData: IconCardData = {
    }

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <LinkWrapper to="/launchpad/sales">
                    <IconCard {...cardData} mr={[null, null, null, '16px']} mt={['32px', null, null, '0']} style={{flex: 1, height:'fit-content'}} background='rgba(255, 255, 255, 0.7)'>
                        <Flex flexDirection="column" alignItems="center">
                            <Heading color='primary' scale="xl" textAlign="center">
                                {t('40')}
                            </Heading>
                            <Text color='secondary' textAlign="center" mt="12px">
                                {t('Pre-sales Created')}
                            </Text>
                        </Flex>
                    </IconCard>
                </LinkWrapper>
                <Heading color='primary' scale="xl" textAlign="center" mt="24px">
                    {t('Pre-sale Marketplace')}
                </Heading>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('Marketplace is an open, decentralized platform for token Presales.')}
                </Text>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('Create Presales in seconds with a simple decentralized form.')}
                </Text>
            </Flex>
        </>
    )
    
}

export default PresaleSection