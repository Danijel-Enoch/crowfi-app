import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'
import { AddressZero } from '@ethersproject/constants'
import { PayableOverrides } from 'ethers'
import { BIG_TEN } from 'utils/bigNumber'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const createStandardToken = async (tokenFactory, feeAmount, tokenName, symbol, decimals, supply, routerAddress, tokenOwner) => {
  const gasPrice = getGasPrice()

  const args = [tokenName, symbol, decimals, supply, routerAddress, tokenOwner];

  const tx = await callWithEstimateGas(tokenFactory, 'deployNewInstance', [tokenName, symbol, decimals, supply, routerAddress, tokenOwner], { gasPrice}, 1000, feeAmount)
  const receipt = await tx.wait()
  return receipt.status
}

export const createLiquidityToken = async (tokenFactory, feeAmount, tokenName, symbol, decimals, supply, txFee, lpFee, dexFee, routerAddress, feeAddress, tokenOwner) => {
  const gasPrice = getGasPrice()

  const args = [tokenName, symbol, decimals, supply, txFee, lpFee, dexFee, routerAddress, feeAddress, tokenOwner];

  const tx = await callWithEstimateGas(tokenFactory, 'deployNewInstance', args, { gasPrice}, 1000, feeAmount)
  const receipt = await tx.wait()
  return receipt.status
}