import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex} from '@pancakeswap/uikit'
import { InfoRow, InfoLabel, InfoValue } from './styled'

const LockerStatusSection: React.FC = () => {

    const { t } = useTranslation()

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Flex flexDirection="column">
                    <InfoRow>
                        <InfoLabel>{t('Status')}</InfoLabel>
                        <InfoValue>{t('inprogress')}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Sale Type')}</InfoLabel>
                        <InfoValue>{t('Public')}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Minimum Buy')}</InfoLabel>
                        <InfoValue>0.01 CRO</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Maximum Buy')}</InfoLabel>
                        <InfoValue>2 CROW</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Total Contributors')}</InfoLabel>
                        <InfoValue>32</InfoValue>
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default LockerStatusSection