import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'

export const buySale = async (manager, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await callWithEstimateGas(manager, 'buy', [value], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const claimSale = async (manager, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await callWithEstimateGas(manager, 'claim', [value], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}