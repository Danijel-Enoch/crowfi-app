import React, { lazy, useEffect } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import useScrollOnRouteChange from 'hooks/useScrollOnRouteChange'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useUserReferrer } from 'state/user/hooks'
import { getCurrentReffererFromUrl } from 'utils'
import { deRot13 } from 'utils/encode'
import { DatePickerPortal } from 'components/DatePicker'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import history from './routerHistory'
// Views included in the main bundle
import Pools from './views/Pools'
import Swap from './views/Swap'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const PrivateSales = lazy(() => import('./views/PrivateSales'))
const Referrals = lazy(() => import('./views/Referrals'))
const NotFound = lazy(() => import('./views/NotFound'))
const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const Liquidity = lazy(() => import('./views/Pool'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))
const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))
const Info = lazy(() => import('./views/Info'))
const Sales = lazy(() => import('./views/Sales'))
const TokenFactory = lazy(() => import('./views/TokenFactory/TokenFactory'))
const Locker = lazy(() => import('./views/Locker/Locker'))
const LockerPage = lazy(() => import('./views/Locker/components/LockerPage/LockerPage'))
const Airdropper = lazy(() => import('./views/Airdropper/Airdropper'))
const SalePage = lazy(() => import('./views/Sales/components/SalePage/SalePage'))
// const Sales = lazy(() => import('./views/Sales'))
// const TokenFactory = lazy(() => import('./views/TokenFactory'))
// const Airdropper = lazy(() => import('./views/Airdropper'))
// const Locker = lazy(() => import('./views/Locker'))


// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account } = useWeb3React()

  const [, setUserReferrer] = useUserReferrer()

  useEffect(() => {
    const referrer = getCurrentReffererFromUrl()
    const referrerDecoded = deRot13(referrer);
    if (referrerDecoded.startsWith('0x')) {
      setUserReferrer(referrerDecoded);
    }
  }, [setUserReferrer])

  usePollBlockNumber()
  useEagerConnect()
  usePollCoreFarmData()
  useScrollOnRouteChange()
  useUserAgent()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            {/* <Route exact path="/farms/auction">
              <FarmAuction />
            </Route> */}
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/referrals">
              <Referrals />
            </Route>
            <Route path="/privatesales">
              <PrivateSales />
            </Route>
            <Route path="/pools">
              <Pools />
            </Route>
            <Route path="/info">
              <Info />
            </Route>

            <Route exact strict path="/presale/view/:address" component={SalePage} />
            <Route path="/presale">
              <Sales/>
            </Route>
            <Route exact path="/token-factory">
              <TokenFactory />
            </Route>
            <Route exact path="/lockers">
              <Locker />
            </Route>
            <Route exact strict path="/lockers/:address" component={LockerPage} />
            <Route exact path="/airdropper">
              <Airdropper />
            </Route>
            {/* <Route path="/sales">
              <Launchpad />
            </Route>
            <Route path="/token-factory">
              <TokenFactory />
            </Route>
            <Route path="/airdropper">
              <Airdropper />
            </Route>
            <Route path="/lockers">
              <Locker />
            </Route> */}
            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Liquidity} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

            {/* Redirect */}
            <Route path="/pool">
              <Redirect to="/liquidity" />
            </Route>
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
