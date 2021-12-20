import { MenuItemsType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: 'Trade',
    href: '/swap',
    showItemsOnMobile: false,
    items: [
      {
        label: t('Token Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity Pairs'),
        href: '/liquidity',
      },
    ],
  },
  {
    label: t('Nests'),
    href: '/farms',
    icon: 'Earn',
    items: [
    ],
  },
  {
    label: t('Referrals'),
    href: '/referrals',
    icon: 'Groups',
    items: []
  },
  {
    label: t('Private Sales'),
    href: '/privatesales',
    icon: 'Earn',
    items: []
  },
  {
    label: t('Bridge'),
    href: undefined,
    icon: 'Trade',
    showItemsOnMobile: true,
    items: [
      {
        type: 1,
        label: t('EvoDeFi Bridge'),
        href: 'https://bridge.evodefi.com',
      },
      {
        type: 1,
        label: t('Cronos Bridge'),
        href: 'https://cronos.crypto.org/docs/bridge/cdcex.html',
      },
    ]
  },

  // {
  //   label: t('Win'),
  //   href: '/prediction',
  //   icon: 'Trophy',
  //   items: [
  //     {
  //       label: t('Prediction (BETA)'),
  //       href: '/prediction',
  //     },
  //     {
  //       label: t('Lottery'),
  //       href: '/lottery',
  //     },
  //   ],
  // },
  // {
  //   label: t('NFT'),
  //   href: `${nftsBaseUrl}`,
  //   icon: 'Nft',
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: `${nftsBaseUrl}`,
  //     },
  //     {
  //       label: t('Collections'),
  //       href: `${nftsBaseUrl}/collections`,
  //     },
  //   ],
  // },
  // {
  //   label: '',
  //   href: '/info',
  //   icon: 'More',
  //   hideSubNav: true,
  //   items: [
  //     {
  //       label: t('Info'),
  //       href: '/info',
  //     },
  //     {
  //       label: t('IFO'),
  //       href: '/ifo',
  //     },
  //     {
  //       label: t('Voting'),
  //       href: '/voting',
  //     },
  //     {
  //       type: DropdownMenuItemType.DIVIDER,
  //     },
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       type: DropdownMenuItemType.DIVIDER,
  //     },
  //     {
  //       label: t('Blog'),
  //       href: 'https://medium.com/pancakeswap',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //     {
  //       label: t('Docs'),
  //       href: 'https://docs.crowfi.app',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //   ],
  // },
]

export default config
