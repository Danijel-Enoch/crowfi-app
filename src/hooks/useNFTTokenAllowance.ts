import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { isAddress } from 'utils'
import { useBaseNFTContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

function useNFTTokenAllowance(contractAddress?: string, owner?: string, spender?: string): string | undefined {
  const tokenAddress = isAddress(contractAddress)
  const contract = useBaseNFTContract(tokenAddress === false ? undefined : tokenAddress)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'isApprovedForAll', inputs).result

  return useMemo(
    () => (contractAddress && allowance ? allowance.toString() : undefined),
    [contractAddress, allowance],
  )
}

export default useNFTTokenAllowance
