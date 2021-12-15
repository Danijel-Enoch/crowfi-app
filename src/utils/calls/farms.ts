import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'
import { AddressZero } from '@ethersproject/constants'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  // const gasEstimation = estimateGas(contract, methodName, methodArgs, gasMarginPer10000)
  // const rawGasEstimation = await masterChefContract.estimateGas['deposit'](pid, value)
  // const tx = await masterChefContract.deposit(pid, value, { ...options, gasPrice })

  const tx = await callWithEstimateGas(masterChefContract, 'deposit', [pid, value, AddressZero], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await masterChefContract.withdraw(pid, value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(masterChefContract, 'deposit', [pid, 0, AddressZero], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}