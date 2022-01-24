import React, { useState } from 'react'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import IconCard, { IconCardData } from 'views/Home/components/IconCard'
import { LinkWrapper } from '../styled'

const AirdropSection = () => {

    const { t } = useTranslation()

    const cardData: IconCardData = {
    }

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <LinkWrapper to="/utilities/airdropper">
                    <IconCard {...cardData} mr={[null, null, null, '16px']} mt={['32px', null, null, '0']} style={{flex: 1, height:'fit-content'}} background='rgba(255, 255, 255, 0.7)'>
                        <Flex flexDirection="column" alignItems="center">
                            <Heading color='primary' scale="xl" textAlign="center">
                                {t('10')}
                            </Heading>
                            <Text color='secondary' textAlign="center" mt="12px">
                                {t('Airdrops made')}
                            </Text>
                        </Flex>
                    </IconCard>
                </LinkWrapper>
                <Heading color='primary' scale="xl" textAlign="center" mt="24px">
                    {t('Airdropper')}
                </Heading>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('Airdrop tokens or disperse payments with the click of a button.')}
                </Text>
            </Flex>
        </>
    )
    
}

export default AirdropSection