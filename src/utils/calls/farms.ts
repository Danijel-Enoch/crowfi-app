import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'
import { AddressZero } from '@ethersproject/constants'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract, pid, amount, userRefferer) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  if (pid === 0) {
    const tx = await callWithEstimateGas(masterChefContract, 'enterStaking', [value], {
      gasPrice,
    })
    const receipt = await tx.wait()
    return receipt.status
  }
  // const gasEstimation = estimateGas(contract, methodName, methodArgs, gasMarginPer10000)
  // const rawGasEstimation = await masterChefContract.estimateGas['deposit'](pid, value)
  // const tx = await masterChefContract.deposit(pid, value, { ...options, gasPrice })

  let referrer = userRefferer
  if (!userRefferer || !userRefferer.startsWith('0x')) {
    referrer = AddressZero
  }

  const tx = await callWithEstimateGas(masterChefContract, 'deposit', [pid, value, referrer], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  if (pid === 0) {
    const tx = await callWithEstimateGas(masterChefContract, 'leaveStaking', [value], {
      gasPrice,
    })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await callWithEstimateGas(masterChefContract, 'withdraw', [pid, value], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()
  if (pid === 0) {
    const tx = await callWithEstimateGas(masterChefContract, 'leaveStaking', [0], {
      gasPrice,
    })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await callWithEstimateGas(masterChefContract, 'deposit', [pid, 0, AddressZero], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}