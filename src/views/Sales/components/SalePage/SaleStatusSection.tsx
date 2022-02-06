import React, { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex } from '@pancakeswap/uikit'
import { SALE_FINALIZE_DEADLINE } from 'config/constants'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { InfoRow, InfoLabel, InfoValue } from './styled'
import { PaymentType, PublicSaleData } from '../../types'

export interface SaleStatusSectionProps {
    sale: PublicSaleData
}

const SaleStatusSection: React.FC<SaleStatusSectionProps> = ({sale}) => {

    const { t } = useTranslation()

    const status = useMemo(() => {
        const now = new Date().getTime() / 1000;

        if (sale.canceled) {
            return t('Canceled')
        }
        if (sale.finalized) {
            return t('Finalized')
        }

        if (sale.closingTime + SALE_FINALIZE_DEADLINE < now) {
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
                        <InfoValue>{ sale.whitelistEnabled ? t('Private') : t('Public')}</InfoValue>
                    </InfoRow>
                    {/* <InfoRow>
                        <InfoLabel>{t('Payment Type')}</InfoLabel>
                        <Flex>
                            <InfoValue color={sale.paymentType === PaymentType.ESCROW ? "primary" : "gray"}>{t('Escrow')}</InfoValue>
                            <InfoValue>{t('|')}</InfoValue>
                            <InfoValue color={sale.paymentType === PaymentType.DIRECT ? "primary" : "gray"}>{t('Direct Payment')}</InfoValue>
                        </Flex>
                    </InfoRow> */}
                    <InfoRow>
                        <InfoLabel>{t('Minimum Contribution')}</InfoLabel>
                        <InfoValue>{getFullDisplayBalance(sale.minContribution)} CRO</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Maximum Contribution')}</InfoLabel>
                        <InfoValue>{getFullDisplayBalance(sale.maxContribution)} CRO</InfoValue>
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default SaleStatusSection