import React, { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex } from '@pancakeswap/uikit'
import { InfoRow, InfoLabel, InfoValue } from './styled'
import { PublicSaleData } from '../../types'

export interface SaleStatusSectionProps {
    sale: PublicSaleData
}

const SaleStatusSection: React.FC<SaleStatusSectionProps> = ({sale}) => {

    const { t } = useTranslation()

    const status = useMemo(() => {
        const now = new Date().getTime() / 1000;
        if (sale.finalized) {
            return t('Finalized')
        }

        if (sale.closingTime < now) {
            return t('Closed')
        }

        if (sale.openingTime < now) {
            return t('In Progress')
        }

        return t('Pending')
    }, [sale, t])

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Flex flexDirection="column">
                    <InfoRow>
                        <InfoLabel>{t('Status')}</InfoLabel>
                        <InfoValue>{status}</InfoValue>
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
                        <InfoValue>2 CRO</InfoValue>
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default SaleStatusSection