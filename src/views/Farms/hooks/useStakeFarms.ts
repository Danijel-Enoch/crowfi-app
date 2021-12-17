import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useUserReferrer } from 'state/user/hooks'

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef()
  const [ userReferrer ] = useUserReferrer()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeFarm(masterChefContract, pid, amount, userReferrer)
      console.info(txHash)
    },
    [masterChefContract, pid, userReferrer],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
