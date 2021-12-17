import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'
import { useTokenBalance } from 'state/wallet/hooks'
import { getBep20Contract, getErc20Contract } from 'utils/contractHelpers'
import tokens from 'config/constants/tokens'

export const buySale = async (manager, amount) => {

  let limit: BigNumber = new BigNumber(0)
  const contract = getErc20Contract(tokens.pcrow.address)
  try {
    const res = await contract.balanceOf(manager.address)
    limit = new BigNumber(res.toString())
  } catch (e) {
    console.log(e)
  }

  if (new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).gt(limit)) {
    throw new Error('All sold out')
  }
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