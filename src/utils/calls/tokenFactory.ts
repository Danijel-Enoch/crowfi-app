import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const createStandardToken = async (tokenFactory, feeAmount, tokenName, symbol, decimals, supply, routerAddress, tokenOwner) => {
  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(tokenFactory, 'create', [tokenName, symbol, decimals, supply], { gasPrice}, 1000, feeAmount)
  const receipt = await tx.wait()
  if (receipt.status === 1) {
    /* eslint-disable dot-notation */
    const ev = Array.from(receipt["events"]).filter((v) =>  {
      return v["event"] === "TokenCreated"
    });

    console.log('events', ev)

    if (ev.length > 0) {
      const resArgs = ev[0]["args"];

      return resArgs['token'];
    }
    /* eslint-enable dot-notation */
  }
  return null
}

export const createLiquidityToken = async (tokenFactory, feeAmount, tokenName, symbol, decimals, supply, txFee, lpFee, dexFee, routerAddress, feeAddress) => {
  const gasPrice = getGasPrice()

  const args = [tokenName, symbol, decimals, supply, routerAddress, feeAddress, new BigNumber(txFee).multipliedBy(100).toJSON(), new BigNumber(lpFee).multipliedBy(100).toJSON(), new BigNumber(dexFee).multipliedBy(100).toJSON()];

  const tx = await callWithEstimateGas(tokenFactory, 'create', args, { gasPrice}, 1000, feeAmount)
  const receipt = await tx.wait()
  if (receipt.status === 1) {
    /* eslint-disable dot-notation */
    const ev = Array.from(receipt["events"]).filter((v) =>  {
      return v["event"] === "TokenCreated"
    });

    console.log('events', ev)

    if (ev.length > 0) {
      const resArgs = ev[0]["args"];

      return resArgs['token'];
    }
    /* eslint-enable dot-notation */
  }
  return null
}