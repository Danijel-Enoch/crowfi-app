import React, { useMemo, useEffect } from 'react'
import { Text, Heading, Card } from '@pancakeswap/uikit'
import Page2 from 'components/Layout/Page2'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import { useAllTokenData, useTokenDatas } from 'state/info/hooks'
import { useWatchlistTokens } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC = () => {
  const { t } = useTranslation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  const [savedTokens] = useWatchlistTokens()
  const watchListTokens = useTokenDatas(savedTokens)

  return (
    <Page2>
      <Heading scale="lg" mb="16px" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
        {t('Your Watchlist')}
      </Heading>
      {savedTokens.length > 0 ? (
        <TokenTable tokenDatas={watchListTokens} />
      ) : (
        <Card>
          <Text py="16px" px="24px">
            {t('Saved tokens will appear here')}
          </Text>
        </Card>
      )}
      <TopTokenMovers />
      <Heading scale="lg" mt="40px" mb="16px" id="info-tokens-title" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page2>
  )
}

export default TokensOverview
