import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import 'moment-timezone'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, Heading } from '@pancakeswap/uikit'
import { DeserializedPrivateSale } from 'state/types'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { FetchStatus } from 'hooks/useTokenBalance'
import PrivateSaleBuyCard from './PrivateSaleBuyCard'
import PrivateSaleClaimCard from './PrivateSaleClaimCard'

const StyledWrapper= styled(Flex)`
`
const SectionWrapper = styled(Flex)`
  padding: 20px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px 40px;
  }
`

interface PrivateSaleRowProps {
  sale: DeserializedPrivateSale
  account?: string,
  usdcBalance?: BigNumber,
  usdcFetchStatus: FetchStatus
}

enum SaleStatus {
  NOT_STARTED,
  ACTIVE,
  ENDED,
  CLAIMING,
  EXPIRED
}

const PrivateSaleRow: React.FC<PrivateSaleRowProps> = ({ sale, account, usdcBalance, usdcFetchStatus }) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState(SaleStatus.NOT_STARTED)

  useEffect(() => {
    const now = new Date().getTime()
    let status_ = SaleStatus.NOT_STARTED
    if (sale.claimEndDate?.getTime() < now) {
      status_ = SaleStatus.EXPIRED
    } else if (sale.claimStartDate?.getTime() <= now) {
      status_ = SaleStatus.CLAIMING
    } else if (sale.endDate?.getTime() < now) {
      status_ = SaleStatus.ENDED
    } else if (sale.startDate?.getTime() < now) {
      status_ = SaleStatus.ACTIVE
    }
    setStatus(status_)
  }, [sale])

  return (
      <StyledWrapper flexDirection={['column', 'column', 'column', 'row']}>
        <SectionWrapper flexDirection="column" style={{flex:1}} justifyContent="center">
          <Heading scale="lg" color="primary" mb="24px">
          {sale.name}
          </Heading>
          <Text fontSize="16px">
            {t(sale.desc, {date : sale.startDate?.toDateString()})}
          </Text>
          { 
            status === SaleStatus.NOT_STARTED ?  
            (
              <>
                <Text fontSize="16px">
                  {t('Beginning on')}&nbsp; {sale.startDate ? moment.utc(sale.startDate).format('ddd MMM Do, h A z') : ''}
                </Text>
                <Text fontSize="16px">
                  Price per token ${sale.price}
                </Text>

                {
                  sale.whitelistEnabled && !sale.userData?.whitelisted &&
                  (
                    <Text fontSize="16px" color="warn">
                      ( You are not white-listed )
                    </Text>
                  )
                }
              </>
            )
            : status === SaleStatus.ACTIVE ?  
            (
              <>
                <Text fontSize="16px">
                  {t('It ends on')}&nbsp;{sale.endDate ? moment.utc(sale.endDate).format('ddd MMM Do, h A z') : ''}
                </Text>
                <Text fontSize="16px" color="warn">
                  Price per token ${sale.price}
                </Text>

                {
                  sale.whitelistEnabled && !sale.userData?.whitelisted &&
                  (
                    <Text fontSize="16px">
                      ( You are not white-listed )
                    </Text>
                  )
                }
              </>
            )
            : status === SaleStatus.ENDED ?  
            (
              <Text fontSize="16px">
                {t('All sold and claim will be start on')}&nbsp;{sale.claimStartDate ? moment.utc(sale.claimStartDate).format('ddd MMM Do, h A z') : ''}
              </Text>
            )
            : status === SaleStatus.CLAIMING ?  
            (
              <Text fontSize="16px">
                {t('Claim will be end on ')}&nbsp;{sale.claimEndDate ? moment.utc(sale.claimEndDate).format('ddd MMM Do, h A z') : ''}
              </Text>
            )
            : 
            (
              <Text fontSize="16px">
                {t('All sold and claim ended. If you did not claim your tokens, contact us with your wallet address')}
              </Text>
            )
          }

          { status !== SaleStatus.NOT_STARTED && sale.userData?.purchasedBalance.eq(0) && (
            <Text fontSize="14px" color="secondary">
            {t('No tokens purchased.')}
            </Text>
          )}
          { status !== SaleStatus.NOT_STARTED && sale.userData?.purchasedBalance.gt(0) && (
            <Text fontSize="14px" color="secondary">
              {t('You purchased %amount% CROW for this sale', {amount: getBalanceNumber(sale.userData?.purchasedBalance)})}
            </Text>
          )}
          { status !== SaleStatus.NOT_STARTED && sale.userData?.claimedBalance.gt(0) && (
            <Text fontSize="14px" color="secondary">
              {t('You claimed %amount% CROW for this sale', {amount: getBalanceNumber(sale.userData?.claimedBalance)})}
            </Text>
          )}
          { status !== SaleStatus.NOT_STARTED && sale.userData?.claimableBalance.gt(0) && (
            <Text fontSize="14px" color="secondary">
              {t('You can claim %amount% CROW now', {amount: getBalanceNumber(sale.userData?.claimableBalance)})}
            </Text>
          )}
        </SectionWrapper>
        <SectionWrapper justifyContent="center" alignItems="center">
          {/* <PrivateSaleBuyCard sale={sale} /> */}
          { (status === SaleStatus.CLAIMING || status === SaleStatus.ENDED) && (
            <PrivateSaleClaimCard account={account} sale={sale} enabled={status === SaleStatus.CLAIMING}/>
          )}
          { (status === SaleStatus.ACTIVE  || status === SaleStatus.NOT_STARTED) && (
            <PrivateSaleBuyCard account={account} sale={sale} usdcBalance={usdcBalance} enabled={status === SaleStatus.ACTIVE && (!sale.whitelistEnabled || sale.userData?.whitelisted)} />
          )}
          
        </SectionWrapper>
        

      </StyledWrapper>
  )
}

export default PrivateSaleRow
