import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useGasPrice } from 'state/user/hooks'
import { useTransactionAdder, useHasPendingApproval, useHasPendingApprovalForAll } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useBaseNFTContract } from './useContract'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import useERC721TokenAllowance from './useNFTTokenAllowance'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useNFTApproveCallback(
  contractAddress?: string,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const currentAllowance = useERC721TokenAllowance(contractAddress, account ?? undefined, spender)
  const pendingApproval = useHasPendingApprovalForAll(contractAddress, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!contractAddress || !spender) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN
    const val = Boolean(JSON.parse(currentAllowance))
    if (val) {
      console.log('allowance', currentAllowance)
      return ApprovalState.APPROVED
    }
    
    return pendingApproval ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED

  }, [contractAddress, currentAllowance, pendingApproval, spender])

  const tokenContract = useBaseNFTContract(contractAddress)
  const addTransaction = useTransactionAdder()

  const gasPrice = useGasPrice()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }
    const estimatedGas = await tokenContract.estimateGas.setApprovalForAll(spender, true)

    // eslint-disable-next-line consistent-return
    return callWithGasPrice(
      tokenContract,
      'setApprovalForAll',
      [spender, true],
      {
        gasLimit: calculateGasMargin(estimatedGas),
        gasPrice
      },
    )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Approve`,
          approval: { tokenAddress: contractAddress, spender },
        })
      })
      .catch((error: Error) => {
        console.error('Failed to approve token', error)
        throw error
      })
  }, [approvalState, contractAddress, tokenContract, spender, addTransaction, callWithGasPrice, gasPrice])

  return [approvalState, approve]
}

