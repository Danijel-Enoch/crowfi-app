import { useLiquidityGeneratorTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'

export function useLPTokenFees(address: string) : [number|undefined, number|undefined] {
  const contract = useLiquidityGeneratorTokenContract(address)
  const taxFee: BigNumber = useSingleCallResult(contract, '_taxFee')?.result?.[0]
  const lpFee: BigNumber = useSingleCallResult(contract, '_liquidityFee')?.result?.[0]

  const taxFeeNumber = taxFee ? taxFee.toNumber() / 100 : undefined
  const lpFeeNumber = lpFee ? lpFee.toNumber() / 100 : undefined
  return [taxFeeNumber, lpFeeNumber]
}