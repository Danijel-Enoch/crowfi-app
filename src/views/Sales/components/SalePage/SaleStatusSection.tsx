import React, { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex, Skeleton } from '@pancakeswap/uikit'
import { SALE_FINALIZE_DEADLINE } from 'config/constants'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useToken } from 'hooks/Tokens'
import { InfoRow, InfoLabel, InfoValue } from './styled'
import { PaymentType, PublicSaleData } from '../../types'

export interface SaleStatusSectionProps {
    sale: PublicSaleData
}

const SaleStatusSection: React.FC<SaleStatusSectionProps> = ({sale}) => {

    const { t } = useTranslation()
    const baseToken = useToken(sale.baseToken)

    const baseTokenSymbol = useMemo(() => {
        if (sale.useETH) {
            return 'CRO'
        }
        if (baseToken) {
            return baseToken.symbol
        }

        return ''
    }, [sale, baseToken])

    const baseTokenDecimals = useMemo(() => {
        if (sale.useETH) {
            return 18
        }
        if (baseToken) {
            return baseToken.decimals
        }

        return -1
    }, [sale, baseToken])

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
                    <InfoRow>
                        <InfoLabel>{t('Minimum Contribution')}</InfoLabel>
                        { baseTokenDecimals >= 0 ? (
                            <InfoValue>{getFullDisplayBalance(sale.minContribution, baseTokenDecimals)} {baseTokenSymbol}</InfoValue>
                        ) : (
                            <Skeleton width="40px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Maximum Contribution')}</InfoLabel>
                        { baseTokenDecimals >= 0 ? (
                            <InfoValue>{getFullDisplayBalance(sale.maxContribution, baseTokenDecimals)} {baseTokenSymbol}</InfoValue>
                        ) : (
                            <Skeleton width="40px" height="30px"/>
                        )}
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default SaleStatusSection