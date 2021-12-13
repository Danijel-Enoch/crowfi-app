import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Crow Finance',
  description:
    'CrowFi - Crow Finance is a One-Stop-DeFi-Shop! The ultimate Cross-Chain DEX of the Cronos Network. We provide you with tools to invest, trade & earn with ease.',
  image: 'https://crowfi.app/logo.png',
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
  } else if (path.startsWith('/crowfi-squad')) {
    basePath = '/crowfi-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('CrowFi')}`,
      }
    case '/swap':
      return {
        title: `${t('Token Exchange')} | ${t('CrowFi')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('CrowFi')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('CrowFi')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity Pairs')} | ${t('CrowFi')}`,
      }
    case '/privatesales':
      return {
        title: `${t('Private Sales')} | ${t('CrowFi')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('CrowFi')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('CrowFi')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('CrowFi')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('CrowFi')}`,
      }
    case '/farms':
      return {
        title: `${t('Nests')} | ${t('CrowFi')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('CrowFi')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('CrowFi')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('CrowFi')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('CrowFi')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('CrowFi')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('CrowFi')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('CrowFi')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('CrowFi')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('CrowFi Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('CrowFi Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('CrowFi Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('CrowFi')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('CrowFi')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('CrowFi')}`,
      }
    default:
      return null
  }
}
