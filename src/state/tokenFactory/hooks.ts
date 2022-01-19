import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import { BIG_ZERO } from 'utils/bigNumber'
import BigNumber from 'bignumber.js'
import { State } from '../types'
import { fetchTokenFactoryPublicDataAsync } from '.'


export const usePollTokenFactoryData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchTokenFactoryPublicDataAsync())
  }, [dispatch, slowRefresh])
}

export const useTokenFactoryDeployeFee = () => {
  const fee = useSelector((state: State) => state.tokenFactory.deployFee)
  return fee ? new BigNumber(fee) : BIG_ZERO
}

export const useLiquidityTokenFactoryDeployeFee = () => {
  const fee = useSelector((state: State) => state.tokenFactory.lpDeployFee)
  return fee ? new BigNumber(fee) : BIG_ZERO
}
