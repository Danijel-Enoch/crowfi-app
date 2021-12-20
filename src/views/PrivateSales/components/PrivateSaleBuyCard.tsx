import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Card, Button } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchPrivateSalesUserDataAsync } from 'state/privatesales'
import { DeserializedPrivateSale } from 'state/types'
import useToast from 'hooks/useToast'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { PrivateSaleType } from 'config/constants/types'
import useBuySale from '../hooks/useBuySale'
import { AppHeader } from '../../../components/App'
import { AutoColumn } from '../../../components/Layout/Column'
import PSPriceInput from './PSPriceInput'
import useApproveJoinSale from '../hooks/useApproveJoinSale'

const StyledCard = styled(Card)`
  filter: ${({ theme }) => theme.card.dropShadow};
  align-self: baseline;
`

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

interface PPrivateSaleBuyCardProps {
  sale: DeserializedPrivateSale
  enabled: boolean
  account?: string,
  usdcBalance: BigNumber
}

const PrivateSaleBuyCard: React.FC<PPrivateSaleBuyCardProps> = ({ sale, enabled, account, usdcBalance }) => {
  const [val, setVal] = useState('')
  const { toastError } = useToast()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { quoteAllowance } = sale.userData || {}
  const isApproved = account && quoteAllowance && quoteAllowance.isGreaterThan(0)
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const max = useMemo(() => {
    return sale.userData ? new BigNumber(1e22).div(sale.price).minus(sale.userData.purchasedBalance) : new BigNumber(1e24)
  }, [sale])
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const quoteToken = useERC20(sale.quoteToken.address)
  const { onApprove } = useApproveJoinSale(quoteToken, getAddress(sale.manager))
  const { onBuy } = useBuySale(getAddress(sale.manager))

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchPrivateSalesUserDataAsync({ account, types: [sale.type] }))
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setRequestedApproval(false)
    }
  }, [onApprove, dispatch, account, t, toastError, sale.type])

  const handleChange = useCallback(
    (value: string) => {
      setVal(value)
    },
    [setVal],
  )

  const handleBuy = useCallback(async () => {
    try {
      setPendingTx(true)
      await onBuy(val)
      dispatch(fetchPrivateSalesUserDataAsync({ account, types: [sale.type] }))
    } catch (e) {
      if (typeof e === 'object' && 'message' in e) {
        const err: any = e;
        toastError(t('Error'), err.message)
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }, [onBuy, dispatch, account, t, toastError, sale.type, val])

  const renderApprovalOrBuyButton = () => {
    return isApproved ? (
      <Button
        disabled={!enabled || pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        onClick={handleBuy}
        width="100%"
      >
        {pendingTx ? t('Processing...') : t('Buy')}
      </Button>
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval || !enabled} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
      <StyledCard >
        <AppHeader title={t('Buy with USDC')} subtitle={t('Your purchase : %amount% CROW', {amount: getBalanceNumber(sale.userData?.purchasedBalance)})} noConfig />
        <Wrapper>
          <AutoColumn gap="md">
            { sale.type === PrivateSaleType.preSale ?
            (
              <PSPriceInput
                enabled={enabled}
                price={sale.price}
                usdcBalance={usdcBalance}
                onChange={handleChange}
                value={val}
                min="5555"
                max="277777"
                symbol="CROW"
              />
            )
            :
            (
              <PSPriceInput
                enabled={enabled}
                price={sale.price}
                usdcBalance={usdcBalance}
                onChange={handleChange}
                value={val}
                min="1"
                max={getBalanceNumber(max).toString()}
                symbol="CROW"
              />
            )}
            
          </AutoColumn>
          <ModalActions>
            
          {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrBuyButton()}
          </ModalActions>
        </Wrapper>

      </StyledCard>
  )
}

export default PrivateSaleBuyCard
