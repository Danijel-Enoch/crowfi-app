import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { AddressZero } from '@ethersproject/constants'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await masterChefContract.deposit(pid, value, '0xd27d9022b1Bcc392Bab187032f961030460e151A', { ...options, gasPrice })
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

  const tx = await masterChefContract.deposit(pid, '0', '0xd27d9022b1Bcc392Bab187032f961030460e151A', { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}