import React, { useCallback, useMemo, useState } from 'react'
import history from 'routerHistory'
import { Button, Flex, Radio, Text } from '@pancakeswap/uikit';
import { useAppDispatch } from 'state';
import BigNumber from 'bignumber.js';
import tokens from 'config/constants/tokens';
import styled from 'styled-components'
import { NFTContractType } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import useToast from 'hooks/useToast';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import { StyledIntegerInput } from 'components/Launchpad/StyledControls';
import BaseSection from './BaseSection';
import { useListNFTMarket } from '../../hooks/useListNFT';
import SPYInput from './CurrencyInput';
import { NFTResponse } from '../../hooks/types';


const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

interface MarketSectionProps {
  nft?: NFTResponse
  account?: string
  available: number
  onComplete?: () => void
  onDismiss?: () => void
}

const MarketSection: React.FC<MarketSectionProps> = ({ nft, account, available, onComplete, onDismiss }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [useToken, setUseToken] = useState(false)
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('1')
  
  const priceNumber = useMemo(() => {
    const number = price && price.length > 0 ? new BigNumber(price) : BIG_ZERO
    return number.multipliedBy(BIG_TEN.pow(useToken ? tokens.usdc.decimals : 18))
  }, [price, useToken])

  const { onListMarket } = useListNFTMarket()

  const isInputValid = useMemo(() => {
    return priceNumber && priceNumber.isFinite() && priceNumber.gt(BIG_ZERO) && parseInt(amount) > 0 && parseInt(amount) <= available
  }, [priceNumber, amount, available])

  const handleChangePrice = useCallback(
      (value: string) => {
      setPrice(value)
      },
      [setPrice],
  )
  const handleSell = useCallback(async() => {

    try {
      setPendingTx(true)
      const marketId = await onListMarket(
        useToken, 
        nft.id.toString(),
        nft.contractAddress,
        nft.contractType.toString(),
        nft.tokenId,
        amount,
        priceNumber.toString()
      )
      toastSuccess(t('Success'), t('Your NFT has been listed on the market'))
      onDismiss()
      onComplete()
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
  }, [onListMarket, onComplete, onDismiss, toastError, toastSuccess, t, nft, useToken, priceNumber, amount])

  return (
    <BaseSection nft={nft} pendingTx={pendingTx} available={available} account={account} onDismiss={onDismiss} handleSell={handleSell} isInputValid={isInputValid}>
      <Flex  margin="8px 0px" flexDirection="column">
        <Text fontSize='14px'>
          {t('Token Amount:')}
        </Text>
        <StyledIntegerInput
          value={amount}
          onUserInput={(value) => setAmount(value)}
        />
      </Flex>
      <Flex flexDirection='row' justifyContent="center" margin="8px 0px">
        <RadioGroup onClick={() => setUseToken(false)}>
          <Radio onChange={() => null} scale="sm" checked={!useToken} />
          <Text ml="8px">{t('Sell with CRO')}</Text>
        </RadioGroup>

        <RadioGroup onClick={() => setUseToken(true)}>
          <Radio onChange={() => null} scale="sm" checked={useToken} />
          <Text ml="8px">{t('Sell with %symbol%', {symbol: tokens.usdc.symbol})}</Text>
        </RadioGroup>
      </Flex>
      <Flex  margin="8px 0px" flexDirection="column">
        <Text fontSize='14px'>
          {t('Total Price:')}
        </Text>
        <SPYInput
          enabled
          value={price}
          symbol={useToken ? tokens.usdc.symbol : "CRO"}
          onChange={handleChangePrice}
        />
      </Flex>
    </BaseSection>
  )
}

export default MarketSection
