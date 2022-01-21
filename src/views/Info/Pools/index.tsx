import React, { useMemo } from 'react'
import { Text, Heading, Card } from '@pancakeswap/uikit'
import Page2 from 'components/Layout/Page2'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { useAllPoolData, usePoolDatas } from 'state/info/hooks'
import { useWatchlistPools } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'

const PoolsOverview: React.FC = () => {
  const { t } = useTranslation()

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const [savedPools] = useWatchlistPools()
  const watchlistPools = usePoolDatas(savedPools)

  return (
    <Page2>
      <Heading scale="lg" mb="16px" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
        {t('Your Watchlist')}
      </Heading>
      <Card>
        {watchlistPools.length > 0 ? (
          <PoolTable poolDatas={watchlistPools} />
        ) : (
          <Text px="24px" py="16px">
            {t('Saved pools will appear here')}
          </Text>
        )}
      </Card>
      <Heading scale="lg" mt="40px" mb="16px" id="info-pools-title"  color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
        {t('All Pools')}
      </Heading>
      <PoolTable poolDatas={poolDatas} />
    </Page2>
  )
}

export default PoolsOverview
