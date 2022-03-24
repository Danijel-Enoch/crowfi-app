import React, { lazy } from 'react'
import { Redirect, Route } from 'react-router-dom'
import CreateCollection from './pages/CreateCollection'


const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const Collections = lazy(() => import('./pages/Collections'))
const Collection = lazy(() => import('./pages/Collection'))
const Assets = lazy(() => import('./pages/Assets'))
const Asset = lazy(() => import('./pages/Asset'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./components/NotFound'))
const CreateNFT = lazy(() => import('./pages/CreateNFT'))

const NFTMarket: React.FC = () => {
    const nftsBaseUrl = '/nft'

    return (
      <>
        <Route exact path={nftsBaseUrl}>
          <Home />
        </Route>
        <Route exact path={`${nftsBaseUrl}/explore-collections`}>
          <Explore />
        </Route>
        <Route path={`${nftsBaseUrl}/collections`}>
          <Collections />
        </Route>
        <Route path={`${nftsBaseUrl}/collections/:collectionType`}>
          <Collections />
        </Route>
        <Route path={`${nftsBaseUrl}/collection/:slug`} component={Collection} />
        <Route path={`${nftsBaseUrl}/assets`}>
          <Assets />
        </Route>
        <Route path={`${nftsBaseUrl}/create`}>
          <CreateNFT />
        </Route>
        <Route path={`${nftsBaseUrl}/create-collection`}>
          <CreateCollection />
        </Route>
        <Route exact path={`${nftsBaseUrl}/asset`}>
          <NotFound />
        </Route>
        <Route path={`${nftsBaseUrl}/asset/:address/:assetId`}>
          <Asset />
        </Route>
        <Route exact path={`${nftsBaseUrl}/profile`}>
          <Profile />
        </Route>
        <Route path={`${nftsBaseUrl}/profile/:profileId`}>
          <Profile />
        </Route>
      </>
    )
}

export default NFTMarket