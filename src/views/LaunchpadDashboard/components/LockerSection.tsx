import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import IconCard, { IconCardData } from 'views/Home/components/IconCard'

const LockerSection = () => {

    const { t } = useTranslation()

    const cardData: IconCardData = {
    }

    return (
        <>
            <Flex flexDirection="column" alignItems="center">
                <IconCard {...cardData} mr={[null, null, null, '16px']} mt={['32px', null, null, '0']} style={{flex: 1, height:'fit-content'}} background='rgba(255, 255, 255, 0.7)'>
                    <Flex flexDirection="column" alignItems="center">
                        <Heading color='primary' scale="xl" textAlign="center">
                            {t('10')}
                        </Heading>
                        <Text color='secondary' textAlign="center" mt="12px">
                            {t('Lockers made')}
                        </Text>
                    </Flex>
                </IconCard>
                <Heading color='primary' scale="xl" textAlign="center" mt="24px">
                    {t('Lockers')}
                </Heading>
                <Text color='secondary' textAlign="center" mt="12px">
                    {t('Lockers is our Locking Dapp for Liquidity / Token locking')}
                </Text>
            </Flex>
        </>
    )
    
}

export default LockerSection