import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, Heading, Button, Modal } from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchPrivateSalesUserDataAsync } from 'state/privatesales'
import { DeserializedPrivateSale } from 'state/types'
import useToast from 'hooks/useToast'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { AppHeader, AppBody } from '../../../components/App'
import Column, { AutoColumn } from '../../../components/Layout/Column'
import PSClaimInput from './PSClaimInput'
import useApproveClaimSale from '../hooks/useApproveClaimSale'
import useClaimSale from '../hooks/useClaimSale'


const StyledCard = styled(Card)`
  align-self: baseline;
`

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

interface PPrivateSaleBuyCardProps {
  sale: DeserializedPrivateSale
  account?: string
  enabled: boolean
}

const PrivateSaleClaimCard: React.FC<PPrivateSaleBuyCardProps> = ({ sale, account, enabled }) => {
  const [val, setVal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { tempAllowance } = sale.userData || {}
  const isApproved = account && tempAllowance && tempAllowance.isGreaterThan(0)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const fullBalance = useMemo(() => {
    return sale.userData ? getFullDisplayBalance(sale.userData?.claimableBalance) : '0'
  }, [sale.userData])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (value: string) => {
      setVal(value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(sale.userData ? getBalanceNumber(sale.userData?.claimableBalance).toString() : '0')
  }, [sale.userData, setVal])

  const quoteToken = useERC20(sale.tempToken.address)
  const { onApprove } = useApproveClaimSale(quoteToken, getAddress(sale.manager))
  const { onClaim } = useClaimSale(getAddress(sale.manager))

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

  const handleClaim = useCallback(async () => {
    try {
      setPendingTx(true)
      await onClaim(val)
      dispatch(fetchPrivateSalesUserDataAsync({ account, types: [sale.type] }))
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }, [onClaim, dispatch, account, t, toastError, sale.type, val])



  const renderApprovalOrClaimButton = () => {
    return isApproved ? (
      <Button
        disabled={!enabled || pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        onClick={handleClaim}
        width="100%"
      >
        {pendingTx ? t('Claiming...') : t('Claim')}
      </Button>
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval || !enabled} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
      <StyledCard >
        <AppHeader title={t('')} subtitle={t('Claim your tokens')} noConfig />
        <Wrapper>
          <AutoColumn gap="md">
            <PSClaimInput
              enabled={enabled}
              onChange={handleChange}
              onSelectMax={handleSelectMax}
              value={val}
              max={sale.userData?.claimableBalance}
              symbol="CROW"
            />
          </AutoColumn>
          <ModalActions>
          {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrClaimButton()}
          </ModalActions>
        </Wrapper>

        

      </StyledCard>
  )
}

export default PrivateSaleClaimCard
