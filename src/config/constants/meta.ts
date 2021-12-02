import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'SmartyPay',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Referral')} | ${t('SmartyPay')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('SmartyPay')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('SmartyPay')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('SmartyPay')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('SmartyPay')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('SmartyPay')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('SmartyPay')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('SmartyPay')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('SmartyPay')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('SmartyPay')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('SmartyPay')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('SmartyPay')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('SmartyPay')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('SmartyPay')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('SmartyPay')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('SmartyPay')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('SmartyPay')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('SmartyPay')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('SmartyPay Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('SmartyPay Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('SmartyPay Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('SmartyPay')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('SmartyPay')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('SmartyPay')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('SmartyPay')}`,
      }
    default:
      return null
  }
}
