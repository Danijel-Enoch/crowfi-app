import React from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import useTotalReferralCount from 'hooks/useTotalReferralCount'
import { useTranslation } from 'contexts/Localization'

const TotalReferralCount = () => {
    const { t } = useTranslation()
    const referralCount = useTotalReferralCount()
    return (
        <Flex justifyContent="start" alignItems="center" mb="8px" mt="16px">
            <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mr="24px">
                {t('Total Referrals')}
            </Text>
            <Text>{referralCount}</Text>
        </Flex>
    )
}

export default TotalReferralCount